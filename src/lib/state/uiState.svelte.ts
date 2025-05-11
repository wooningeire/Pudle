import { placeNewTiles, gameState, locateIslands, type Point, getAdjacentGrays, eliminateTiles, setNextGuessTileIds, isGameOver, applyTags, tilesFromMatchResults, isFirstGuess, removeTags, resetGameState } from "./gameState.svelte.ts";
import { Tile, TileColor } from "$lib/types/Tile.ts";
import { guessMatches, matchResults, isValidGuess, nextWord, recordGuessResults, updateKnownLetterInfo, resetRoundState } from "./roundState.svelte.ts";
import { TileTag } from "$lib/types/TileTag.ts";
import type { MatchResult } from "../types/MatchResult.ts";

export const uiState = $state({
    guess: "",
    inputLocked: false,
    flipping: false,
    guessTiles: <Tile[]>[],
    currentIslands: <Point[][]>[],
    currentGrays: <Point[]>[],
    gameOver: false,
});

const resetGuessTiles = (guess=uiState.guess) => {
    uiState.guessTiles = guess
        .padEnd(5, " ")
        .split("")
        .map((char, i) => new Tile(gameState.guessTileIds[i], TileColor.Empty, char === " " ? "" : char));
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
        const mockGuess = existingTiles.map(tile => tile?.letter ?? " ").join("");

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

const destroyCellsIfApplicable = async () => {
    while (true) {
        const islands = locateIslands();
        if (islands.length === 0) break;

        const grays = getAdjacentGrays(islands);
        
        await wait(750);
        
        uiState.currentIslands = islands;
        uiState.currentGrays = grays;

        eliminateTiles(islands, grays);
    }
};

export const consumeGuess = async () => {
    if (uiState.inputLocked) return;
    if (!await isValidGuess(uiState.guess)) return;

    const results = matchResults(uiState.guess);
    const tiles = tilesFromMatchResults(uiState.guess, results);

    uiState.inputLocked = true;
    uiState.flipping = true;
    uiState.guessTiles = <Tile[]>tiles;

    await wait(isFirstGuess() ? 2250 : 875); // wait for the flipping animation

    if (!isFirstGuess()) {
        updateKnownLetterInfo(uiState.guess, results); // delay this until later for the first guess
    }
    placeNewTiles(tiles);
    recordGuessResults(uiState.guess, results);

    uiState.flipping = false;
    resetGuessTiles(""); // make sure the letters don't render in their original spots

    await wait(isFirstGuess() ? 1500 : 500); // falling animation

    setNextGuessTileIds();
    resetGuessTiles(""); // switch to the new ids of the guess tiles

    await destroyCellsIfApplicable();

    if (guessMatches(uiState.guess)) {
        await wait(500);

        await nextWord();
        gameState.stats.nthWord++;
    }

    await wait(250);

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
        await wait(500);

        uiState.gameOver = true;
        return;
    }

    if (isFirstGuess()) {
        updateKnownLetterInfo(uiState.guess, results);
        updateInfoFromReevaluation(evaluationsOfExistingRows);
    }

    gameState.stats.nthGuess++;
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
    if (uiState.guess.length >= 5) return;

    uiState.guess += char;
    resetGuessTiles();
};

export const reset = async () => {
    await resetRoundState();
    resetGameState();
    
    uiState.guess = "";
    uiState.inputLocked = false;
    uiState.flipping = false;
    uiState.currentIslands = [];
    uiState.currentGrays = [];
    uiState.gameOver = false;
    resetGuessTiles();
};