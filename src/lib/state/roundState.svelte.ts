import { SvelteMap } from "svelte/reactivity";
import { MatchResult } from "$lib/types/MatchResult";
import { Tile, TileColor } from "$lib/types/Tile";
import { initialLoadState } from "./initialLoadState.svelte";
import { TileTag } from "$lib/types/TileTag";
import { emplace, update } from "$lib/emplace";
import { WORD_LENGTH } from "../constants";


export enum PositionType {
    MustBeInPosition,
    NoInfo,
    MustNotBeInPosition,
}

export type KnownLetterInfo = {
    type: MatchResult,
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
            type: MatchResult.Empty,
            positionInfo: new Array(WORD_LENGTH).fill(0).map(() => PositionType.NoInfo)
        };
    });
}




export const nextWord = async () => {
    roundState.word = (await initialLoadState.services).words.getRandomTargetWord();
    roundState.guessedWords.clear();
    resetKnownLetterInfo();
};

export const guessMatches = (guess: string) => {
    return guess === roundState.word;
}


const updateInfoFromResult = (index: number, char: string, result: MatchResult) => {
    const info = roundState.knownLetterInfo[char];


    switch (result) {
        case MatchResult.Match:
            updateInfoFromKnownChar(index, char);
    
            roundState.knownLetterInfo[char].type = MatchResult.Match;
            return;

        case MatchResult.Misplaced: {
            const newPositionInfo = [...info.positionInfo];
            newPositionInfo[index] = PositionType.MustNotBeInPosition;

            roundState.knownLetterInfo[char] = {
                type: info.type === MatchResult.Match
                    ? MatchResult.Match
                    : MatchResult.Misplaced,
                positionInfo: newPositionInfo,
            };
            return;
        }

        // Absent must be handled after processing the rest of these
    }
};

const updateInfoFromMismatchResults = (index: number, guess: string, result: MatchResult) => {
    const char = guess[index];

    const info = roundState.knownLetterInfo[char];
    
    // Absent appears when there are more instances of a letter than in the guess
    const nActualAppearances = roundState.word.split("").filter(letter => letter === char).length;
    const nKnownPositions = info.positionInfo.filter(positionType => positionType === PositionType.MustBeInPosition).length;

    switch (result) {
        case MatchResult.Misplaced: {
            const nRemainingPositions = info.positionInfo.filter(positionType => positionType === PositionType.NoInfo).length;
            if (nActualAppearances - nKnownPositions !== nRemainingPositions) return false;

            // The remaining instances must be in the remaining spots
            for (const [i, positionType] of info.positionInfo.entries()) {
                if (positionType === PositionType.MustNotBeInPosition) continue;
                updateInfoFromKnownChar(i, char);
            }
        }

        case MatchResult.Absent: {
            let newPositionInfo: PositionType[];
            if (nActualAppearances === nKnownPositions) {
                // We know where those instances should be already
                newPositionInfo = info.positionInfo.map(
                    positionType => positionType === PositionType.MustBeInPosition
                        ? PositionType.MustBeInPosition
                        : PositionType.MustNotBeInPosition
                );
            } else {
                // We just know it's not at this index
                newPositionInfo = [...info.positionInfo];
                newPositionInfo[index] = PositionType.MustNotBeInPosition;
            }

            if (newPositionInfo.every((positionType, i) => positionType === info.positionInfo[i])) return false;
        
            roundState.knownLetterInfo[char] = {
                type: info.type === MatchResult.Empty
                    ? MatchResult.Absent
                    : info.type,
                positionInfo: newPositionInfo,
            };
        }
    }
    return true;
};

const updateInfoFromKnownChar = (index: number, char: string) => {
    forEachLetter(letter => {
        if (letter === char) return;
        roundState.knownLetterInfo[letter].positionInfo[index] = PositionType.MustNotBeInPosition;
    });

    const newPositionInfo = [...roundState.knownLetterInfo[char].positionInfo];
    newPositionInfo[index] = PositionType.MustBeInPosition;

    roundState.knownLetterInfo[char].positionInfo[index] = PositionType.MustBeInPosition;
};

export const updateKnownLetterInfo = (guess: string, matchResults: MatchResult[]) => {
    let mismatchIndices: number[] = [];
    for (const [i, result] of matchResults.entries()) {
        if (guess[i] === " " || result === MatchResult.Empty) continue;

        updateInfoFromResult(i, guess[i], result);

        if ([MatchResult.Absent, MatchResult.Misplaced].includes(result)) {
            mismatchIndices.push(i);
        }
    }

    while (true) {
        let changeOccurred = false;

        for (const index of mismatchIndices) {
            changeOccurred ||= updateInfoFromMismatchResults(index, guess, matchResults[index]);
        }
        if (!changeOccurred) break;
    }
};

export const isValidGuess = async (guess: string) => {
    return (
        guess.length === WORD_LENGTH
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


const init = async () => {
    resetKnownLetterInfo();
    await (async () => {
        roundState.word = (await initialLoadState.services).words.getRandomTargetWord();
        roundState.ready = true;
    })();
};

export const resetRoundState = async () => {
    roundState.word = "";
    roundState.guessedWords.clear();
    roundState.knownLetterInfo = {};
    roundState.ready = false;

    await init();
};

init();