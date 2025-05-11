import { emplace, update } from "$lib/emplace.ts";
import { TileColor, Tile } from "$lib/types/Tile.ts";
import { ISLAND_SIZE_THRESHOLD, N_ROWS, WORD_LENGTH } from "$lib/constants.ts";
import { MatchResult } from "$lib/types/MatchResult.ts";
import type { TileTag } from "../types/TileTag";

export const gameState = $state({
    board: new Array(WORD_LENGTH).fill(0).map(() => <Tile[]>[]),

    currentColors: {
        match: TileColor.Green,
        misplaced: TileColor.Yellow,
        absent: TileColor.Gray,
    },

    nextTileId: 0n,
    guessTileIds: <bigint[]>[],

    stats: {
        nthWord: 1,
        nthGuess: 1,
    },

    hasRestarted: false,
});

export const nextTileId = () => gameState.nextTileId++;

export const setNextGuessTileIds = () => {
    gameState.guessTileIds = new Array(WORD_LENGTH).fill(0).map(() => nextTileId());
};
setNextGuessTileIds();

export const removeTags = (tags: TileTag[]) => {
    for (const tag of tags) {
        const tile = gameState.board[tag.x][tag.y];
        gameState.board[tag.x][tag.y] = new Tile(tile.id, tile.color, tile.letter, null);
    }
};

export const applyTags = (tags: TileTag[]) => {
    for (const tag of tags) {
        const tile = gameState.board[tag.x][tag.y];
        gameState.board[tag.x][tag.y] = new Tile(tile.id, tile.color, tile.letter, tag.tagColor);
    }
};


export const placeNewTiles = (tiles: (Tile | null)[]) => {
    for (const [i, tile] of tiles.entries()) {
        if (tile === null) continue;

        gameState.board[i].push(tile);
    }
};


export const tilesFromMatchResults = (guess: string, results: MatchResult[], existingTiles: (Tile | null)[] | null=null) => {
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
}


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
    if (x < 0 || x >= WORD_LENGTH) return false;
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

    for (let x = 0; x < WORD_LENGTH; x++) {
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

        visited[x][y] = true;
        const tile = gameState.board[x][y];
        if (visited[x][y] && tile.color !== TileColor.Gray) return;

        eliminatedGrays.push({x, y});
    };

    for (const island of islands) {
        for (const point of island) {
            const {x, y} = point;
            checkGray(x - 1, y - 1);
            checkGray(x - 1, y);
            checkGray(x - 1, y + 1);
            checkGray(x, y - 1);
            checkGray(x, y + 1);
            checkGray(x + 1, y - 1);
            checkGray(x + 1, y + 1);
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

export const isFirstGuess = () => !gameState.hasRestarted && gameState.stats.nthGuess === 1;


export const resetGameState = () => {
    gameState.board = new Array(WORD_LENGTH).fill(0).map(() => []);

    gameState.currentColors = {
        match: TileColor.Green,
        misplaced: TileColor.Yellow,
        absent: TileColor.Gray,
    };

    setNextGuessTileIds();
    

    gameState.stats = {
        nthWord: 1,
        nthGuess: 1,
    };

    gameState.hasRestarted = true;
};