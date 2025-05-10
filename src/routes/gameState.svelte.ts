import { SvelteSet } from "svelte/reactivity";
import { emplace, update } from "./emplace.ts";
import { Tile, TileType } from "./Tile.ts";
import { createWordGetter } from "./words.ts";


type InitialLoad = {
    words: Awaited<ReturnType<typeof createWordGetter>>,
};

export const gameState = $state({
    initialLoad: <InitialLoad | null>null,

    currentWord: "",
    currentGuess: "",
    guessedWordsThisRound: new SvelteSet<string>(),
    
    board: new Array(9).fill(0).map(
        () => new Array(5).fill(0).map(() => new Tile())
    ),

    currentColors: {
        match: TileType.Green,
        misplaced: TileType.Yellow,
        absent: TileType.Gray,
    },
});

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

export const isValidGuess = (guess: string) => {
    return (
        guess.length === 5
        && gameState.initialLoad!.words.isValidGuess(guess)
        && !gameState.guessedWordsThisRound.has(guess)
    );
};

const resultsOfGuess = (guess: string) => {
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

    return results;
};



const placeTile = (column: number, tile: Tile) => {
    if (tile.type === TileType.Empty) return true;

    const lowestEmptyTileRow = gameState.board.findLastIndex(row => row[column].type === TileType.Empty);

    if (lowestEmptyTileRow === -1) {
        return false;
    }

    gameState.board[lowestEmptyTileRow][column] = tile;
    return true;
};


export const submitGuess = (guess: string) => {
    if (guess === gameState.currentWord) {
        nextWord();
        return;
    }


    gameState.guessedWordsThisRound.add(guess);

    const newTiles = resultsOfGuess(guess).map((result, i) => {
        switch (result) {
            case MatchResult.Match:
                return new Tile(gameState.currentColors.match, guess[i]);
            case MatchResult.Misplaced:
                return new Tile(gameState.currentColors.misplaced, guess[i]);
            case MatchResult.Absent:
                return new Tile(gameState.currentColors.absent, guess[i]);
        }
    });

    let pass = true;
    for (const [i, tile] of newTiles.entries()) {
        pass &&= placeTile(i, tile);
    }

};