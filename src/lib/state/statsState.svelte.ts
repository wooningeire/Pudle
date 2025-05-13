export const statsStateMain = $state({
    nthWord: 1,
    nthGuess: 1,
    hasRestarted: false,
});

const stateDerived = $derived({
    isFirstGuess: !statsStateMain.hasRestarted && statsStateMain.nthGuess === 1,
});

export const statsState = () => stateDerived;

export const resetStatsState = () => {
    statsStateMain.nthGuess = 1;
    statsStateMain.nthWord = 1;

    statsStateMain.hasRestarted = true;
};