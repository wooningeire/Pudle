import { placeNewTiles, gameState, locateIslands, type Point, getAdjacentGrays, eliminateTiles as destroyTiles, setNextGuessTileIds, isGameOver, applyTags, tilesFromMatchResults, isFirstGuess, removeTags, resetGameState, getIslandOfColor } from "./gameState.svelte.ts";
import { Tile, TileColor } from "$lib/types/Tile.ts";
import { guessedCorrectly, matchResults, isValidGuess, nextWord, recordGuessResults, updateKnownLetterInfo, getRoundStateResetter, roundState } from "./roundState.svelte.ts";
import { TileTag } from "$lib/types/TileTag.ts";
import { MatchResult } from "../types/MatchResult.ts";
import { GUESS_TIME_BY_GUESS_NO_DECAY_FAC, GUESS_TIME_BY_WORD_NO_DECAY_FAC, MAX_TIME_LIMIT_S_BY_WORD_NO, MIN_TIME_DECAY_LIMIT_S_BY_GUESS_NO, MIN_TIME_LIMIT_S_BY_WORD_NO, WORD_LENGTH, MAX_TIME_DECAY_LIMIT_S_BY_GUESS_NO, EMPTY_TILE_CHAR, N_ROWS } from "../constants.ts";
import { pauseTimer, resetTimerState, restartTimer, setTimeLimit, startTimer, timerState } from "./timerState.svelte.ts";

export const uiState = $state({
    guess: "",
    inputLocked: false,
    flipping: false,
    guessTiles: <Tile[]>[],
    currentIslands: <Point[][]>[],
    currentGrays: <Point[]>[],
    gameOver: false,
    discoveredBlueTiles: false,
});

const resetGuessTiles = (guess=uiState.guess) => {
    uiState.guessTiles = guess
        .padEnd(WORD_LENGTH, EMPTY_TILE_CHAR)
        .split("")
        .map((char, i) => new Tile(gameState.guessTileIds[i], TileColor.Empty, char === EMPTY_TILE_CHAR ? "" : char));
};

type ExistingRowEvaluation = {
    y: number,
    mockGuess: string,
    results: MatchResult[],
    existingTiles: Tile[],
};

const reevaluateExistingRows = function* () {
    const maxColumnHeight = Math.max(...gameState.board.map(column => column.length));
    for (let y = 0; y < maxColumnHeight; y++) {
        const existingTiles = gameState.board.map(column => column[y] ?? null);
        const mockGuess = existingTiles.map(tile => tile?.letter ?? EMPTY_TILE_CHAR).join("");

        const results = matchResults(mockGuess);

        yield {y, mockGuess, results, existingTiles};
    }
};

const checkIfTilesNeedTagging = (evaluations: ExistingRowEvaluation[]) => {
    const tags: TileTag[] = [];

    for (const {y, mockGuess, results, existingTiles} of evaluations) {
        const tiles = tilesFromMatchResults(mockGuess, results, existingTiles);

        for (const [x, tile] of tiles.entries()) {
            if (tile === null) continue;

            const existingTile = gameState.board[x][y];

            if (tile.color === existingTile.tagColor) continue;
            tags.push(new TileTag(x, y, existingTile, tile.color));
        }
    }

    return tags;
};

const updateInfoFromReevaluation = (evaluations: ExistingRowEvaluation[]) => {
    for (const {mockGuess, results} of evaluations) {
        updateKnownLetterInfo(mockGuess, results);
    }
};

resetGuessTiles();

const wait = (ms: number=0) => new Promise(resolve => {
    setTimeout(resolve, ms);
});

const locateAndDestroyLargeGroups = async () => {
    while (true) {
        const islands = locateIslands();
        if (islands.length === 0) break;

        const grays = getAdjacentGrays(islands);
        
        await wait(750);
        
        uiState.currentIslands = islands;
        uiState.currentGrays = grays;

        destroyTiles(...islands.flat(), ...grays);
    }
};

const nextGuessTimeLimit = () => {
    // https://www.desmos.com/calculator/jledjyjotv
    const maxTimeLimitByWordNo = MIN_TIME_LIMIT_S_BY_WORD_NO + 2 * (MAX_TIME_LIMIT_S_BY_WORD_NO - MIN_TIME_LIMIT_S_BY_WORD_NO) / (1 + Math.exp((gameState.stats.nthWord - 1) * GUESS_TIME_BY_WORD_NO_DECAY_FAC));
    const minTimeLimitByWordNo = MIN_TIME_DECAY_LIMIT_S_BY_GUESS_NO + 2 * (MAX_TIME_DECAY_LIMIT_S_BY_GUESS_NO - MIN_TIME_DECAY_LIMIT_S_BY_GUESS_NO) / (1 + Math.exp((gameState.stats.nthWord - 1) * GUESS_TIME_BY_WORD_NO_DECAY_FAC));
    const timeLimitByGuessNo = minTimeLimitByWordNo + 2 * (maxTimeLimitByWordNo - minTimeLimitByWordNo) / (1 + Math.exp((roundState.guessedWords.size - 1) * GUESS_TIME_BY_GUESS_NO_DECAY_FAC));

    return timeLimitByGuessNo * 1000;
};

const dropGarbage = async () => {
    const lastGuess = uiState.guess;

    uiState.guess = "×".repeat(WORD_LENGTH);
    await consumeGuess(true);

    if (!isGameOver()) {
        uiState.guess = lastGuess;
        resetGuessTiles();
    }
};

/**
 * To be called whenever the board gets rearranged after eliminating tiles
 * @returns 
 */
const boardChangeChecks = async () => {
    const evaluationsOfExistingRows = [...reevaluateExistingRows()];

    const tags = checkIfTilesNeedTagging(evaluationsOfExistingRows);
    if (!isFirstGuess()) {
        updateInfoFromReevaluation(evaluationsOfExistingRows);
    }


    if (tags.length > 0) {
        removeTags(tags);

        await wait(500);
        
        applyTags(tags);
    }


    if (isGameOver()) {
        await wait(1000);

        uiState.gameOver = true;
        return {shouldContinue: false, evaluationsOfExistingRows};
    }

    return {shouldContinue: true, evaluationsOfExistingRows};
};

export const consumeGuess = async (isGarbage=false) => {
    if (uiState.inputLocked) return;
    if (!isGarbage && !await isValidGuess(uiState.guess)) return;

    pauseTimer();

    const results = matchResults(uiState.guess);
    let tiles = <Tile[]>tilesFromMatchResults(uiState.guess, results);

    uiState.inputLocked = true;
    uiState.flipping = true;
    uiState.guessTiles = tiles;

    await wait(isFirstGuess() ? 2250 : 875); // wait for the flipping animation

    if (results.every(result => result === MatchResult.Match)) {
        await wait(250);

        tiles = tiles.map(tile => new Tile(tile.id, TileColor.Blue, tile.letter, tile.tagColor));
        uiState.guessTiles = tiles;
        uiState.discoveredBlueTiles = true;

        await wait(750);
    }

    if (!isGarbage && !isFirstGuess()) {
        updateKnownLetterInfo(uiState.guess, results); // delay this until later for the first guess
    }
    placeNewTiles(tiles);
    if (!isGarbage) {
        recordGuessResults(uiState.guess, results);
    }

    uiState.flipping = false;
    resetGuessTiles(""); // make sure the letters don't render in their original spots

    await wait(isFirstGuess() ? 1500 : 500); // falling animation

    setNextGuessTileIds();
    resetGuessTiles(""); // switch to the new ids of the guess tiles

    await locateAndDestroyLargeGroups();

    if (guessedCorrectly(uiState.guess)) {
        await wait(500);

        await nextWord();
        gameState.stats.nthWord++;
    }

    await wait(250);

    const {shouldContinue, evaluationsOfExistingRows} = await boardChangeChecks();
    if (!shouldContinue) return;

    if (isFirstGuess()) {
        updateKnownLetterInfo(uiState.guess, results);
        updateInfoFromReevaluation(evaluationsOfExistingRows);
    }

    restartTimer(dropGarbage, nextGuessTimeLimit());

    if (!isGarbage) {
        gameState.stats.nthGuess++;
    }
    uiState.guess = "";
    uiState.inputLocked = false;
};

export const backspaceGuess = () => {
    if (uiState.inputLocked) return;

    uiState.guess = uiState.guess.slice(0, -1);
    resetGuessTiles();
};

export const extendGuess = (char: string) => {
    if (uiState.inputLocked) return;
    if (uiState.guess.length >= WORD_LENGTH) return;
    if (gameState.board[uiState.guess.length].length >= N_ROWS) return;

    uiState.guess += char;
    resetGuessTiles();
};

export const selectColorOfBlueTile = async (x: number, y: number, color: TileColor) => {
    if (uiState.inputLocked) return;

    uiState.inputLocked = true;

    pauseTimer();

    const island = getIslandOfColor({x, y}, color);
    const grays = getAdjacentGrays([island]);
    destroyTiles(...island.flat(), ...grays);

    await wait(500);

    await locateAndDestroyLargeGroups();

    const {shouldContinue} = await boardChangeChecks();
    if (!shouldContinue) return;

    startTimer(dropGarbage);
    uiState.inputLocked = false;
};

export const reset = async () => {
    const resetRoundState = await getRoundStateResetter();
    resetGameState();
    resetTimerState();
    resetRoundState();

    setTimeLimit(MAX_TIME_LIMIT_S_BY_WORD_NO * 1000);
    
    uiState.guess = "";
    uiState.inputLocked = false;
    uiState.flipping = false;
    uiState.currentIslands = [];
    uiState.currentGrays = [];
    uiState.gameOver = false;
    resetGuessTiles();
};