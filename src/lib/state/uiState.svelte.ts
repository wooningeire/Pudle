import { isValidGuess, nextWordIfGuessMatched, placeNewTiles, recordGuess, gameState, locateIslands, type Point, getAdjacentGrays, eliminateTiles, setNextGuessTiles, isGameOver, createTilesFromGuess, updateKnownInfoFromTiles, checkIfTilesNeedTagging, applyTags } from "./gameState.svelte.ts";
import { Tile, TileColor } from "$lib/types/Tile.ts";

export const uiState = $state({
    guess: "",
    inputLocked: false,
    flipping: false,
    guessTiles: <Tile[]>[],
    currentIslands: <Point[][]>[],
    currentGrays: <Point[]>[],
    gameOver: false,
});

const resetGuessTiles = () => {
    uiState.guessTiles = uiState.guess
        .padEnd(5, " ")
        .split("")
        .map((char, i) => new Tile(gameState.guessTileIds[i], TileColor.Empty, char === " " ? "" : char));
};

resetGuessTiles();

const wait = (ms: number=0) => new Promise(resolve => {
    setTimeout(resolve, ms);
});

export const consumeGuess = async () => {
    if (uiState.inputLocked) return;
    if (!isValidGuess(uiState.guess)) return;

    recordGuess(uiState.guess);
    const results = createTilesFromGuess(uiState.guess);

    uiState.inputLocked = true;
    uiState.flipping = true;
    uiState.guessTiles = <Tile[]>results;

    await wait(gameState.stats.nthGuess === 1 ? 2000 : 850);

    placeNewTiles(results);
    updateKnownInfoFromTiles(results);

    nextWordIfGuessMatched(uiState.guess);

    uiState.guess = "";
    uiState.flipping = false;
    resetGuessTiles();

    if (gameState.stats.nthGuess === 1) {
        await wait(1000);
    } else {
        await wait(0);
    }


    setNextGuessTiles();
    resetGuessTiles();


    while (true) {
        const islands = locateIslands();
        if (islands.length === 0) break;

        const grays = getAdjacentGrays(islands);
        
        uiState.currentIslands = islands;
        uiState.currentGrays = grays;

        await wait(500);

        eliminateTiles(islands, grays);
    }


    const tagAssignments = checkIfTilesNeedTagging();

    if (tagAssignments.length > 0) {
        await wait(750);
        
        applyTags(tagAssignments);
    }


    if (isGameOver()) {
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