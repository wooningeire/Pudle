let offsetWhenNextStart = 0;
let lastTimeout = 0;

export const timerState = $state({
    paused: true,
    lastStartedAt: 0,
    msRemainingAtLastStart: 0,
    timeLimit: 0,
    msRemainingAtLastPause: 0,
});

export const resumeTimer = (onFinish: () => void) => {
    if (!timerState.paused) return;

    timerState.lastStartedAt = Date.now();
    timerState.paused = false;

    timerState.msRemainingAtLastStart = timerState.msRemainingAtLastPause;
    lastTimeout = setTimeout(() => {
        pauseTimer();
        onFinish();
    }, timerState.msRemainingAtLastStart);
};

export const pauseTimer = () => {
    if (timerState.paused) return;

    timerState.msRemainingAtLastPause = timerState.msRemainingAtLastStart - (Date.now() - timerState.lastStartedAt);
    timerState.paused = true;
    clearTimeout(lastTimeout);
};

export const restartTimer = (onFinish: () => void, newTimeLimit: number | null=null) => {
    pauseTimer();

    offsetWhenNextStart = 0;

    if (newTimeLimit !== null) {
        setTimeLimit(newTimeLimit);
    }

    resumeTimer(onFinish);
};

export const setTimeLimit = (limit: number) => {
    timerState.timeLimit = limit;
    timerState.msRemainingAtLastPause = limit;
};

export const resetTimerState = () => {
    timerState.lastStartedAt = 0;
    offsetWhenNextStart = 0;
    timerState.paused = true;
    lastTimeout = 0;
    timerState.timeLimit = 0;
    timerState.msRemainingAtLastPause = 0;
    timerState.msRemainingAtLastStart = 0;
};