import {base} from "$app/paths";

const parseResponse = async (response: Response) => {
    return (await response.text()).split(/\s+/).filter(word => word.length === 5);
}

export const createWordGetter = async () => {
    const [canBeAnswer, cannotBeAnswer] = await Promise.all([
        fetch(`${base}/words/can-be-answer.txt`).then(parseResponse),
        fetch(`${base}/words/cannot-be-answer.txt`).then(parseResponse),
    ]);

    const validGuesses = new Set([...canBeAnswer, ...cannotBeAnswer]);

    return {
        getRandomTargetWord: () => canBeAnswer[Math.floor(Math.random() * canBeAnswer.length)],
        isValidGuess: (guess: string) => validGuesses.has(guess),
    };
};