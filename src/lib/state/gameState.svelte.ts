import { SvelteMap, SvelteSet } from "svelte/reactivity";
import { emplace, update } from "$lib/emplace.ts";
import { TileColor, Tile } from "$lib/types/Tile.ts";
import { createWordGetter } from "$lib/words.ts";
import { ISLAND_SIZE_THRESHOLD, N_ROWS } from "$lib/constants.ts";


type InitialLoad = {
    words: Awaited<ReturnType<typeof createWordGetter>>,
};

type KnownLetterInfo = {
    type: TileColor,
    mustBeInPositions: Set<number>,
    mustNotBeInPositions: Set<number>,
};

export const gameState = $state({
    initialLoad: <InitialLoad | null>null,

    currentWord: "",
    currentGuess: "",
    guessedWordsThisRound: new SvelteSet<string>(),
    knownLetterInfo: new SvelteMap<string, KnownLetterInfo>(),
    
    board: new Array(5).fill(0).map(() => <Tile[]>[]),

    currentColors: {
        match: TileColor.Green,
        misplaced: TileColor.Yellow,
        absent: TileColor.Gray,
    },

    nextTileId: 0n,
    guessTileIds: <bigint[]>[],

    stats: {
        nWordsFound: 0,
        nGuessesMade: 0,
    },
});

export const nextTileId = () => gameState.nextTileId++;

export const setNextGuessTiles = () => {
    gameState.guessTileIds = new Array(5).fill(0).map(() => nextTileId());
};
setNextGuessTiles();


export const initialLoadPromise = (async () => {
    gameState.initialLoad = {
        words: await createWordGetter(),
    };

    gameState.currentWord = gameState.initialLoad.words.getRandomTargetWord();
})();

enum MatchResult {
    Empty,
    Match,
    Misplaced,
    Absent,
}

export const recalculateExistingTiles = () => {
    const maxColumnHeight = Math.max(...gameState.board.map(column => column.length));
    for (let y = 0; y < maxColumnHeight; y++) {
        const existingTiles = gameState.board.map(column => column[y] ?? null);

        const tiles = createTilesFromGuess(existingTiles.map(tile => tile?.letter ?? " ").join(""), existingTiles);
        updateKnownInfoFromTiles(tiles);

        for (const [x, tile] of tiles.entries()) {
            if (tile === null) continue;

            const existingTile = gameState.board[x][y];
            gameState.board[x][y] = new Tile(existingTile.id, existingTile.color, existingTile.letter, tile.color);
        }
    }
};

const nextWord = () => {
    gameState.guessedWordsThisRound.clear();
    gameState.knownLetterInfo.clear();
    gameState.currentWord = gameState.initialLoad!.words.getRandomTargetWord();
    gameState.stats.nWordsFound++;
};

export const nextWordIfGuessMatched = (guess: string) => {
    if (guess !== gameState.currentWord) return false;

    nextWord();

    return true;
};

const getInfoFromTile = (i: number, tile: Tile): KnownLetterInfo => {
    const info = gameState.knownLetterInfo.get(tile.letter) ?? {
        type: TileColor.Gray,
        mustBeInPositions: new Set(),
        mustNotBeInPositions: new Set(),
    };

    switch (tile.color) {
        case TileColor.Green:
            return {
                type: TileColor.Green,
                mustBeInPositions: new Set([...info.mustBeInPositions, i]),
                mustNotBeInPositions: new Set([...info.mustNotBeInPositions]),
            };

        case TileColor.Yellow: {
            const type = info.type === TileColor.Green
                ? TileColor.Green
                : TileColor.Yellow;

            return {
                type: type,
                mustBeInPositions: new Set([...info.mustBeInPositions]),
                mustNotBeInPositions: new Set([...info.mustNotBeInPositions, i]),
            };
        }

        case TileColor.Gray:
            return {
                type: info.type,
                mustBeInPositions: new Set([...info.mustBeInPositions]),
                mustNotBeInPositions: new Set([...info.mustNotBeInPositions, ...[0, 1, 2, 3, 4].filter(index => !info.mustBeInPositions.has(index))]),
            };
    }

    throw new TypeError();
};

export const updateKnownInfoFromTiles = (tiles: (Tile | null)[]) => {
    for (const [i, tile] of tiles.entries()) {
        if (tile === null) continue;

        gameState.knownLetterInfo.set(tile.letter, getInfoFromTile(i, tile));
    }
};

export const isValidGuess = (guess: string) => {
    return (
        guess.length === 5
        && gameState.initialLoad!.words.isValidGuess(guess)
        && !gameState.guessedWordsThisRound.has(guess)
    );
};

export const createTilesFromGuess = (guess: string, existingTiles: (Tile | null)[] | null=null) => {
    const chars = guess.split("");
    const results = chars.map(() => MatchResult.Absent);

    const letterCounts = new Map<string, number>();
    for (const char of gameState.currentWord) {
        if (char === " ") continue;

        emplace(letterCounts, char, {
            insert: () => 1,
            update: existing => existing + 1,
        });
    }

    for (const [i, char] of chars.entries()) {
        if (char === " ") {
            results[i] = MatchResult.Empty;
            continue;
        }
        if (char !== gameState.currentWord[i]) continue;

        update(letterCounts, char, existing => existing - 1);
        results[i] = MatchResult.Match;
    }

    for (const [i, char] of chars.entries()) {
        if ([MatchResult.Match, MatchResult.Empty].includes(results[i])) continue;
        if ((letterCounts.get(char) ?? 0) === 0) continue;

        update(letterCounts, char, existing => existing - 1);
        results[i] = MatchResult.Misplaced;
    }

    const ids = existingTiles !== null
        ? existingTiles.map(tile => tile?.id ?? null)
        : gameState.guessTileIds;

    return results.map((result, i) => {
        switch (result) {
            case MatchResult.Empty:
                return null;
            case MatchResult.Match:
                return new Tile(ids[i]!, gameState.currentColors.match, guess[i]);
            case MatchResult.Misplaced:
                return new Tile(ids[i]!, gameState.currentColors.misplaced, guess[i]);
            case MatchResult.Absent:
                return new Tile(ids[i]!, gameState.currentColors.absent, guess[i]);
        }
    });
};

export const recordGuess = (guess: string) => {
    gameState.guessedWordsThisRound.add(guess);
};



export const placeNewTiles = (tiles: (Tile | null)[]) => {
    for (const [i, tile] of tiles.entries()) {
        if (tile === null) continue;

        gameState.board[i].push(tile);
    }
};


export type Point = {
    x: number,
    y: number,
};

const hash = (point: Point) => {
    const dataView = new DataView(new ArrayBuffer(16));
    dataView.setFloat64(0, point.x);
    dataView.setFloat64(8, point.y);
    return (dataView.getBigUint64(0) << 8n) + (dataView.getBigUint64(8));
};


const pointIsInBoard = (x: number, y: number) => {
    if (x < 0 || x >= 5) return false;
    if (y < 0 || y >= gameState.board[x].length) return false;

    return true;
};


export const locateIslands = () => {
    const islands: Point[][] = [];

    const visited = gameState.board.map(col => col.map(() => false));

    const dfsExplore = (x: number, y: number, targetColor: TileColor, currentIsland: Point[]) => {
        if (!pointIsInBoard(x, y)) return;
        if (visited[x][y]) return;

        const tile = gameState.board[x][y];
        if (tile.color !== targetColor) return;

        visited[x][y] = true;
        if (targetColor === TileColor.Gray) return;

        currentIsland.push({x, y});
        
        dfsExplore(x - 1, y, targetColor, currentIsland);
        dfsExplore(x + 1, y, targetColor, currentIsland);
        dfsExplore(x, y - 1, targetColor, currentIsland);
        dfsExplore(x, y + 1, targetColor, currentIsland);
    };

    for (let x = 0; x < 5; x++) {
        for (let y = 0; y < gameState.board[x].length; y++) {
            const lookingForColor = gameState.board[x][y].color;

            const currentIsland: Point[] = [];
            dfsExplore(x, y, lookingForColor, currentIsland);

            if (currentIsland.length >= ISLAND_SIZE_THRESHOLD) {
                islands.push(currentIsland);
            }
        }
    }

    return islands;
};

export const getAdjacentGrays = (islands: Point[][]) => {
    const eliminatedGrays: Point[] = [];

    const visited = gameState.board.map(col => col.map(() => false));

    const checkGray = (x: number, y: number) => {
        if (!pointIsInBoard(x, y)) return;
        if (visited[x][y]) return;

        visited[x][y] = true;
        const tile = gameState.board[x][y];
        if (tile.color !== TileColor.Gray) return;

        eliminatedGrays.push({x, y});
    };

    for (const island of islands) {
        for (const point of island) {
            const {x, y} = point;
            checkGray(x - 1, y);
            checkGray(x + 1, y);
            checkGray(x, y - 1);
            checkGray(x, y + 1);
        }
    }

    return eliminatedGrays;
};

export const eliminateTiles = (islands: Point[][], grays: Point[]) => {
    const eliminatedPoints = new Set([
        ...islands.flat(),
        ...grays,
    ].map(point => hash(point)));

    gameState.board = gameState.board.map(
        (col, x) => col.filter((_, y) => !eliminatedPoints.has(hash({x, y})))
    );
};

export const isGameOver = () => {
    return gameState.board.some(column => column.length >= N_ROWS);
};