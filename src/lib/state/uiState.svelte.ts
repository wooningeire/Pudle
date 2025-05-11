import { placeNewTiles, gameState, locateIslands, type Point, getAdjacentGrays, eliminateTiles, setNextGuessTiles, isGameOver, applyTags, tilesFromMatchResults, isFirstGuess, removeTags, resetGameState } from "./gameState.svelte.ts";
import { Tile, TileColor } from "$lib/types/Tile.ts";
import { guessMatches, matchResults, isValidGuess, nextWord, recordGuessResults, updateKnownLetterInfo, resetRoundState } from "./roundState.svelte.ts";
import { TileTag } from "$lib/types/TileTag.ts";

const uiStateInitial = {
    guess: "",
    inputLocked: false,
    flipping: false,
    guessTiles: <Tile[]>[],
    currentIslands: <Point[][]>[],
    currentGrays: <Point[]>[],
    gameOver: false,
};

export const uiState = $state(structuredClone(uiStateInitial));

const resetGuessTiles = () => {
    uiState.guessTiles = uiState.guess
        .padEnd(5, " ")
        .split("")
        .map((char, i) => new Tile(gameState.guessTileIds[i], TileColor.Empty, char === " " ? "" : char));
};

const checkIfTilesNeedTagging = () => {
    const tags: TileTag[] = [];

    const maxColumnHeight = Math.max(...gameState.board.map(column => column.length));
    for (let y = 0; y < maxColumnHeight; y++) {
        const existingTiles = gameState.board.map(column => column[y] ?? null);
        const mockGuess = existingTiles.map(tile => tile?.letter ?? " ").join("");

        const results = matchResults(mockGuess);
        const tiles = tilesFromMatchResults(mockGuess, results, existingTiles);

        updateKnownLetterInfo(mockGuess, results);

        for (const [x, tile] of tiles.entries()) {
            if (tile === null) continue;

            const existingTile = gameState.board[x][y];

            if (tile.color === existingTile.tagColor) continue;
            tags.push(new TileTag(x, y, existingTile, tile.color));
        }
    }

    return tags;
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
    const guess = uiState.guess;

    if (uiState.inputLocked) return;
    if (!await isValidGuess(guess)) return;

    const results = matchResults(guess);
    const tiles = tilesFromMatchResults(guess, results);

    uiState.inputLocked = true;
    uiState.flipping = true;
    uiState.guessTiles = <Tile[]>tiles;

    await wait(isFirstGuess() ? 2250 : 875); // wait for the flipping animation

    updateKnownLetterInfo(guess, results);
    placeNewTiles(tiles);
    recordGuessResults(guess, results);

    uiState.guess = "";
    uiState.flipping = false;
    resetGuessTiles();

    await wait(isFirstGuess() ? 1500 : 500); // falling animation

    setNextGuessTiles();
    resetGuessTiles();

    await destroyCellsIfApplicable();

    if (guessMatches(guess)) {
        await wait(500);

        await nextWord();
        gameState.stats.nthWord++;
    }

    await wait(250);

    const tags = checkIfTilesNeedTagging();

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

    gameState.stats.nthGuess++;
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

export const reset = () => {
    Object.assign(uiState, structuredClone(uiStateInitial));
    resetGameState();
    resetRoundState();
};