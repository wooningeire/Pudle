import { placeNewTiles, gameState, locateIslands, type Point, getAdjacentGrays, eliminateTiles, setNextGuessTiles, isGameOver, applyTags, tilesFromMatchResults, isFirstGuess } from "./gameState.svelte.ts";
import { Tile, TileColor } from "$lib/types/Tile.ts";
import { guessMatches, matchResults, isValidGuess, nextWord, recordGuessResults, updateKnownLetterInfo } from "./roundState.svelte.ts";
import { TileTag } from "$lib/types/TileTag.ts";

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

const checkIfTilesNeedTagging = () => {
    const newAssignments: TileTag[] = [];

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
            newAssignments.push(new TileTag(x, y, existingTile, tile.color));
        }
    }

    return newAssignments;
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
        
        uiState.currentIslands = islands;
        uiState.currentGrays = grays;

        await wait(1000);

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

    updateKnownLetterInfo(uiState.guess, results);
    placeNewTiles(tiles);
    recordGuessResults(uiState.guess, results);

    if (guessMatches(uiState.guess)) {
        nextWord();
        gameState.stats.nthWord++;
    }

    uiState.guess = "";
    uiState.flipping = false;
    resetGuessTiles();

    await wait(isFirstGuess() ? 1500 : 250);

    setNextGuessTiles();
    resetGuessTiles();

    await destroyCellsIfApplicable();

    const tags = checkIfTilesNeedTagging();

    if (tags.length > 0) {
        await wait(750);
        
        applyTags(tags);
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