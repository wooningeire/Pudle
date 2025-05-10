import { isValidGuess, nextWordIfGuessMatched, placeNewTiles, resultsOfGuess, gameState, locateIslands, type Point, getAdjacentGrays, eliminateTiles } from "./gameState.svelte.ts";
import { Tile, TileType } from "./Tile.ts";

export const uiState = $state({
    guess: "",
    inputLocked: false,
    isFlipping: false,
    guessTiles: <Tile[]>[],
    currentIslands: <Point[][]>[],
    currentGrays: <Point[]>[],
});

const resetGuessTiles = () => {
    uiState.guessTiles = uiState.guess
        .padEnd(5, " ")
        .split("")
        .map((char, i) => new Tile(gameState.guessTileIds[i], TileType.Empty, char === " " ? "" : char));
};

resetGuessTiles();

export const consumeGuess = () => {
    if (uiState.inputLocked) return;
    if (!isValidGuess(uiState.guess)) return;

    uiState.inputLocked = true;
    uiState.isFlipping = true;
    const results = resultsOfGuess(uiState.guess);
    uiState.guessTiles = results.map((tile, i) => new Tile(gameState.guessTileIds[i], tile.type, tile.letter));

    setTimeout(() => {
        nextWordIfGuessMatched(uiState.guess);
        placeNewTiles(results);

        uiState.guess = "";
        uiState.isFlipping = false;
        resetGuessTiles();


        const islands = locateIslands();

        if (islands.length === 0) {
            uiState.inputLocked = false;
            return;
        }

        
        const grays = getAdjacentGrays(islands);

        
        uiState.currentIslands = islands;
        uiState.currentGrays = grays;

        setTimeout(() => {
            eliminateTiles(islands, grays);
            uiState.inputLocked = false;
        }, 850);
    }, 850);
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