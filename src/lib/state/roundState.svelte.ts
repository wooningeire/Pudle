import { SvelteMap } from "svelte/reactivity";
import { MatchResult } from "$lib/types/MatchResult";
import { Tile, TileColor } from "$lib/types/Tile";
import { initialLoadState } from "./initialLoadState.svelte";
import { TileTag } from "$lib/types/TileTag";
import { emplace, update } from "$lib/emplace";


export enum PositionType {
    MustBeInPosition,
    NoInfo,
    MustNotBeInPosition,
}

export type KnownLetterInfo = {
    type: TileColor,
    positionInfo: PositionType[],
};


export const roundState = $state({
    word: "",
    guessedWords: new SvelteMap<string, MatchResult[]>(),
    knownLetterInfo: <Record<string, KnownLetterInfo>>{},
    ready: false,
});


const forEachLetter = (fn: (char: string) => void) => {
    for (let i = "A".charCodeAt(0); i <= "Z".charCodeAt(0); i++) {
        fn(String.fromCharCode(i));
    }
};


const resetKnownLetterInfo = () => {
    forEachLetter(char => {
        roundState.knownLetterInfo[char] = {
            type: TileColor.Empty,
            positionInfo: new Array(5).fill(0).map(() => PositionType.NoInfo)
        };
    });
}


resetKnownLetterInfo();
(async () => {
    roundState.word = (await initialLoadState.services).words.getRandomTargetWord();
    roundState.ready = true;
})();




export const nextWord = async () => {
    roundState.word = (await initialLoadState.services).words.getRandomTargetWord();
    roundState.guessedWords.clear();
    resetKnownLetterInfo();
};

export const guessMatches = (guess: string) => {
    return guess === roundState.word;
}


const updateInfoFromTile = (i: number, tile: Tile) => {
    if (tile.letter === "") return;

    const info = roundState.knownLetterInfo[tile.letter];

    switch (tile.color) {
        case TileColor.Empty:
            return;

        case TileColor.Green:
            forEachLetter(char => {
                roundState.knownLetterInfo[char].positionInfo[i] = PositionType.MustNotBeInPosition;
            });

            const newPositionInfo = [...info.positionInfo];
            newPositionInfo[i] = PositionType.MustBeInPosition;


            roundState.knownLetterInfo[tile.letter] = {
                type: TileColor.Green,
                positionInfo: newPositionInfo,
            };
            return;

        case TileColor.Yellow: {
            const newPositionInfo = [...info.positionInfo];
            newPositionInfo[i] = PositionType.MustNotBeInPosition;

            roundState.knownLetterInfo[tile.letter] = {
                type: info.type === TileColor.Green
                    ? TileColor.Green
                    : TileColor.Yellow,
                positionInfo: newPositionInfo,
            };
            return;
        }

        case TileColor.Gray:
            roundState.knownLetterInfo[tile.letter] = {
                type: info.type === TileColor.Empty
                    ? TileColor.Gray
                    : info.type,
                positionInfo: info.positionInfo.map(
                    positionType => positionType === PositionType.MustBeInPosition
                        ? PositionType.MustBeInPosition
                        : PositionType.MustNotBeInPosition
                ),
            };
            return;
    }
};

export const updateKnownInfoFromTiles = (tiles: (Tile | null)[]) => {
    for (const [i, tile] of tiles.entries()) {
        if (tile === null) continue;

        updateInfoFromTile(i, tile);
    }
};

export const isValidGuess = async (guess: string) => {
    return (
        guess.length === 5
        && !roundState.guessedWords.has(guess)
        && (await initialLoadState.services).words.isValidGuess(guess)
    );
};

export const recordGuess = (guess: string) => {
    roundState.guessedWords.set(guess, []);
};

export const guessMatchResults = (guess: string) => {
    const chars = guess.split("");
    const results = chars.map(() => MatchResult.Absent);

    const letterCounts = new Map<string, number>();
    for (const char of roundState.word) {
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
        if (char !== roundState.word[i]) continue;

        update(letterCounts, char, existing => existing - 1);
        results[i] = MatchResult.Match;
    }

    for (const [i, char] of chars.entries()) {
        if ([MatchResult.Match, MatchResult.Empty].includes(results[i])) continue;
        if ((letterCounts.get(char) ?? 0) === 0) continue;

        update(letterCounts, char, existing => existing - 1);
        results[i] = MatchResult.Misplaced;
    }

    return results;
};