const state = $state({
    nthWord: 1,
    nthGuess: 1,
    hasRestarted: false,
});

const stateDerived = $derived({
    nthWord: state.nthWord,
    nthGuess: state.nthGuess,
    hasRestarted: state.hasRestarted,
    isFirstGuess: !state.hasRestarted && state.nthGuess === 1,
});

export const statsState = () => stateDerived;

export const incrementNthWord = () => {
    state.nthWord++;
};
export const incrementNthGuess = () => {
    state.nthGuess++;
};

export const resetStatsState = () => {
    state.nthGuess = 1;
    state.nthWord = 1;

    state.hasRestarted = true;
};