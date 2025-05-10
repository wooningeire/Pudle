import { SvelteSet } from "svelte/reactivity";
import { emplace, update } from "./emplace.ts";
import { TileType, Tile } from "./Tile.ts";
import { createWordGetter } from "./words.ts";
import { ISLAND_SIZE_THRESHOLD, N_ROWS } from "./constants.ts";


type InitialLoad = {
    words: Awaited<ReturnType<typeof createWordGetter>>,
};

export const gameState = $state({
    initialLoad: <InitialLoad | null>null,

    currentWord: "",
    currentGuess: "",
    guessedWordsThisRound: new SvelteSet<string>(),
    
    board: new Array(5).fill(0).map(() => <Tile[]>[]),

    currentColors: {
        match: TileType.Green,
        misplaced: TileType.Yellow,
        absent: TileType.Gray,
    },

    nextTileId: 0n,
    guessTileIds: <bigint[]>[],
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
    Match,
    Misplaced,
    Absent,
}

const nextWord = () => {
    gameState.currentWord = gameState.initialLoad!.words.getRandomTargetWord();
    gameState.guessedWordsThisRound.clear();
};

export const nextWordIfGuessMatched = (guess: string) => {
    if (guess === gameState.currentWord) {
        nextWord();
    }
};

export const isValidGuess = (guess: string) => {
    return (
        guess.length === 5
        && gameState.initialLoad!.words.isValidGuess(guess)
        && !gameState.guessedWordsThisRound.has(guess)
    );
};

export const resultsOfGuess = (guess: string) => {
    gameState.guessedWordsThisRound.add(guess);

    const chars = guess.split("");
    const results = chars.map(() => MatchResult.Absent);

    const letterCounts = new Map<string, number>();
    for (const char of gameState.currentWord) {
        emplace(letterCounts, char, {
            insert: () => 1,
            update: existing => existing + 1,
        });
    }

    for (const [i, char] of chars.entries()) {
        if (char !== gameState.currentWord[i]) continue;

        update(letterCounts, char, existing => existing - 1);
        results[i] = MatchResult.Match;
    }

    for (const [i, char] of chars.entries()) {
        if (results[i] === MatchResult.Match) continue;
        if ((letterCounts.get(char) ?? 0) === 0) continue;

        update(letterCounts, char, existing => existing - 1);
        results[i] = MatchResult.Misplaced;
    }

    return results.map((result, i) => {
        switch (result) {
            case MatchResult.Match:
                return new Tile(gameState.guessTileIds[i], gameState.currentColors.match, guess[i]);
            case MatchResult.Misplaced:
                return new Tile(gameState.guessTileIds[i], gameState.currentColors.misplaced, guess[i]);
            case MatchResult.Absent:
                return new Tile(gameState.guessTileIds[i], gameState.currentColors.absent, guess[i]);
        }
    });
};



export const placeNewTiles = (tiles: Tile[]) => {
    for (const [i, tile] of tiles.entries()) {
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

    const dfsExplore = (x: number, y: number, targetColor: TileType, currentIsland: Point[]) => {
        if (!pointIsInBoard(x, y)) return;
        if (visited[x][y]) return;

        const tile = gameState.board[x][y];
        if (tile.type !== targetColor) return;

        visited[x][y] = true;
        if (targetColor === TileType.Gray) return;

        currentIsland.push({x, y});
        
        dfsExplore(x - 1, y, targetColor, currentIsland);
        dfsExplore(x + 1, y, targetColor, currentIsland);
        dfsExplore(x, y - 1, targetColor, currentIsland);
        dfsExplore(x, y + 1, targetColor, currentIsland);
    };

    for (let x = 0; x < 5; x++) {
        for (let y = 0; y < gameState.board[x].length; y++) {
            const lookingForColor = gameState.board[x][y].type;

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
        if (tile.type !== TileType.Gray) return;

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
}