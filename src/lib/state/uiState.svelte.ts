import { isValidGuess, nextWordIfGuessMatched, placeNewTiles, recordGuess, gameState, locateIslands, type Point, getAdjacentGrays, eliminateTiles, setNextGuessTiles, isGameOver, createTilesFromGuess, updateKnownInfoFromTiles, recalculateExistingTiles } from "./gameState.svelte.ts";
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

    await wait(850);

    placeNewTiles(results);
    updateKnownInfoFromTiles(results);

    const matched = nextWordIfGuessMatched(uiState.guess);

    uiState.guess = "";
    uiState.flipping = false;
    resetGuessTiles();

    await wait(0);

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

    if (matched) {
        await wait(750);

        recalculateExistingTiles();
    }
    
    if (isGameOver()) {
        uiState.gameOver = true;
        return;
    }
    
    gameState.stats.nGuessesMade++;
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