import { gameState, isValidGuess, submitGuess } from "./gameState.svelte.ts";

export const inputState = $state({
    guess: "",
});

export const consumeGuess = () => {
    if (!isValidGuess(inputState.guess)) return;

    submitGuess(inputState.guess);
    inputState.guess = "";
};
export const backspaceGuess = () => {
    inputState.guess = inputState.guess.slice(0, -1);
};
export const extendGuess = (char: string) => {
    if (inputState.guess.length >= 5) return;

    inputState.guess += char;
};