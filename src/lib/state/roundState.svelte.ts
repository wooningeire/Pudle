import { SvelteMap } from "svelte/reactivity";
import { MatchResult } from "$lib/types/MatchResult";
import { Tile, TileColor } from "$lib/types/Tile";
import { initialLoadState } from "./initialLoadState.svelte";
import { TileTag } from "$lib/types/TileTag";
import { emplace, update } from "$lib/emplace";
import { EMPTY_TILE_CHAR, WORD_LENGTH } from "$lib/constants";
import { NoticeMessage } from "./noticeState.svelte";

export const alphabet = new Set("ABCDEFGHIJKLMNOPQRSTUVWXYZ");


export enum PositionType {
    MustBeInPosition,
    NoInfo,
    MustNotBeInPosition,
}

export type KnownLetterInfo = {
    type: MatchResult,
    positionInfo: PositionType[],
    nKnownAppearances: number,
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
            positionInfo: new Array(WORD_LENGTH).fill(0).map(() => PositionType.NoInfo),
            nKnownAppearances: 0,
        };
    });
};




export const nextWord = async () => {
    roundState.word = (await initialLoadState.services).words.getRandomTargetWord();
    roundState.guessedWords.clear();
    resetKnownLetterInfo();
};

export const guessedCorrectly = (guess: string) => {
    return guess === roundState.word;
};


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

            info.type = info.type === MatchResult.Match
                ? MatchResult.Match
                : MatchResult.Misplaced;
            info.positionInfo = newPositionInfo;
            return;
        }

        case MatchResult.Absent: {
            const newPositionInfo = [...info.positionInfo];
            newPositionInfo[index] = PositionType.MustNotBeInPosition;
        
            info.type = info.type === MatchResult.Empty
                ? MatchResult.Absent
                : info.type;
            info.positionInfo = newPositionInfo;
        }
    }
};

const updateInfoFromMismatchResults = (index: number, guess: string, result: MatchResult) => {
    const char = guess[index];

    const info = roundState.knownLetterInfo[char];
    const nKnownPositions = info.positionInfo.filter(positionType => positionType === PositionType.MustBeInPosition).length;

    switch (result) {
        case MatchResult.Misplaced: {
            const nRemainingPositions = info.positionInfo.filter(positionType => positionType === PositionType.NoInfo).length;
            if (info.nKnownAppearances - nKnownPositions !== nRemainingPositions) return false; // User doesn't know where this should go yet

            // The remaining instances must be in the remaining spots
            for (const [i, positionType] of info.positionInfo.entries()) {
                if (positionType === PositionType.MustNotBeInPosition) continue;
                updateInfoFromKnownChar(i, char);
            }
        }

        case MatchResult.Absent: {
            // Absent appears when there are more instances of a letter than in the guess
            const nActualAppearances = roundState.word.split("").filter(letter => letter === char).length;
            if (nActualAppearances !== nKnownPositions) return false;

            // We know where those instances should be already
            const newPositionInfo = info.positionInfo.map(
                positionType => positionType === PositionType.MustBeInPosition
                    ? PositionType.MustBeInPosition
                    : PositionType.MustNotBeInPosition
            );
            if (newPositionInfo.every((positionType, i) => positionType === info.positionInfo[i])) return false;
        
            roundState.knownLetterInfo[char].positionInfo = newPositionInfo;
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

const findNKnownAppearances = (char: string, guess: string, matchResults: MatchResult[]) => {
    return Math.max(
        matchResults.filter((result, i) => guess[i] === char && [MatchResult.Match, MatchResult.Misplaced].includes(result)).length,
        roundState.knownLetterInfo[char].positionInfo.filter(positionType => positionType === PositionType.MustBeInPosition).length,
    );
};

export const updateKnownLetterInfo = (guess: string, matchResults: MatchResult[]) => {
    let mismatchIndices: number[] = [];
    for (const [i, result] of matchResults.entries()) {
        const char = guess[i];
        if (!alphabet.has(char) || result === MatchResult.Empty) continue;

        updateInfoFromResult(i, char, result);
        roundState.knownLetterInfo[char].nKnownAppearances = findNKnownAppearances(char, guess, matchResults);

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

export const invalidGuessMessage = async (guess: string) => {
    if (guess.length !== WORD_LENGTH) {
        return null;
    }
    if (roundState.guessedWords.has(guess)) {
        return NoticeMessage.AlreadyGuessedThisRound;
    }
    if (!(await initialLoadState.services).words.isValidGuess(guess)) {
        return NoticeMessage.NotInWordList;
    }

    return null;
};

export const recordGuessResults = (guess: string, matchResults: MatchResult[]) => {
    roundState.guessedWords.set(guess, matchResults);
};

export const matchResults = (guess: string) => {
    const chars = guess.split("");
    const results = chars.map(() => MatchResult.Absent);

    const letterCounts = new Map<string, number>();
    for (const char of roundState.word) {
        if (!alphabet.has(char)) continue;

        emplace(letterCounts, char, {
            insert: () => 1,
            update: existing => existing + 1,
        });
    }

    for (const [i, char] of chars.entries()) {
        if (char === EMPTY_TILE_CHAR) {
            results[i] = MatchResult.Empty;
            continue;
        }
        if (!alphabet.has(char)) continue;
        if (char !== roundState.word[i]) continue;

        update(letterCounts, char, existing => existing - 1);
        results[i] = MatchResult.Match;
    }

    for (const [i, char] of chars.entries()) {
        if (!alphabet.has(char)) continue;
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

export const getRoundStateResetter = async () => {
    const services = await initialLoadState.services;
    return () => {
        roundState.word = "";
        roundState.guessedWords.clear();
        roundState.knownLetterInfo = {};
        roundState.word = services.words.getRandomTargetWord();
        roundState.ready = true;
        resetKnownLetterInfo();
    };
};

init();