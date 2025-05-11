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

const roundStateInitial = {
    word: "",
    guessedWords: new SvelteMap<string, MatchResult[]>(),
    knownLetterInfo: <Record<string, KnownLetterInfo>>{},
    ready: false,
};

export const roundState = $state(structuredClone(roundStateInitial));


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


const updateInfoFromResult = (i: number, char: string, result: MatchResult) => {
    if (char === " " || result === MatchResult.Empty) return;

    const info = roundState.knownLetterInfo[char];

    switch (result) {
        case MatchResult.Match:
            forEachLetter(letter => {
                roundState.knownLetterInfo[letter].positionInfo[i] = PositionType.MustNotBeInPosition;
            });

            const newPositionInfo = [...info.positionInfo];
            newPositionInfo[i] = PositionType.MustBeInPosition;


            roundState.knownLetterInfo[char] = {
                type: TileColor.Green,
                positionInfo: newPositionInfo,
            };
            return;

        case MatchResult.Misplaced: {
            const newPositionInfo = [...info.positionInfo];
            newPositionInfo[i] = PositionType.MustNotBeInPosition;

            roundState.knownLetterInfo[char] = {
                type: info.type === TileColor.Green
                    ? TileColor.Green
                    : TileColor.Yellow,
                positionInfo: newPositionInfo,
            };
            return;
        }

        case MatchResult.Absent:
            roundState.knownLetterInfo[char] = {
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

const updateInfoFromElimination = () => {
    for (const info of Object.values(roundState.knownLetterInfo)) {
        if (info.positionInfo.filter(positionType => positionType === PositionType.MustNotBeInPosition).length !== 4) continue;

        const lastIndex = info.positionInfo.findIndex(positionType => positionType === PositionType.NoInfo);
        if (lastIndex === -1) continue;

        info.positionInfo[lastIndex] = PositionType.MustBeInPosition;
    }
};

export const updateKnownLetterInfo = (guess: string, matchResults: MatchResult[]) => {
    for (const [i, result] of matchResults.entries()) {
        if (guess[i] === " " || result === MatchResult.Empty) continue;

        updateInfoFromResult(i, guess[i], result);
    }
    updateInfoFromElimination();
};

export const isValidGuess = async (guess: string) => {
    return (
        guess.length === 5
        && !roundState.guessedWords.has(guess)
        && (await initialLoadState.services).words.isValidGuess(guess)
    );
};

export const recordGuessResults = (guess: string, matchResults: MatchResult[]) => {
    roundState.guessedWords.set(guess, matchResults);
};

export const matchResults = (guess: string) => {
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

export const resetRoundState = () => {
    Object.assign(roundState, structuredClone(roundStateInitial));
};