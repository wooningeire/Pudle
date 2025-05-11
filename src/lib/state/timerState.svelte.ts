let offsetWhenNextStart = 0;
let lastTimeout = 0;

export const timerState = $state({
    paused: true,
    lastStartedAt: 0,
    msRemainingAtLastStart: 0,
    timeLimit: 0,
});

export const startTimer = (onFinish: () => void) => {
    if (!timerState.paused) return;

    timerState.lastStartedAt = Date.now();
    timerState.paused = false;

    timerState.msRemainingAtLastStart = timerState.timeLimit - offsetWhenNextStart;
    lastTimeout = setTimeout(() => {
        pauseTimer();
        onFinish();
    }, timerState.msRemainingAtLastStart);
};

export const pauseTimer = () => {
    if (timerState.paused) return;

    offsetWhenNextStart = Date.now() - timerState.lastStartedAt;
    timerState.paused = true;
    clearTimeout(lastTimeout);
};

export const restartTimer = (onFinish: () => void, newTimeLimit: number | null=null) => {
    pauseTimer();

    offsetWhenNextStart = 0;

    if (newTimeLimit !== null) {
        timerState.timeLimit = newTimeLimit;
    }

    startTimer(onFinish);
};

export const setTimeLimit = (limit: number) => {
    timerState.timeLimit = limit;
};

export const resetTimerState = () => {
    timerState.lastStartedAt = 0;
    offsetWhenNextStart = 0;
    timerState.paused = true;
    lastTimeout = 0;
    timerState.timeLimit = 0;
};