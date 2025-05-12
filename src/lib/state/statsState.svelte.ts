export const statsState = $state({
    nthWord: 1,
    nthGuess: 1,
    hasRestarted: false,
});

export const isFirstGuess = () => !statsState.hasRestarted && statsState.nthGuess === 1;

export const resetStatsState = () => {
    statsState.nthGuess = 1;
    statsState.nthWord = 1;

    statsState.hasRestarted = true;
};