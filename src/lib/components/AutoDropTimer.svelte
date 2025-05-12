<script lang="ts">
    import { timerState } from "../state/timerState.svelte";

let msRemaining = $state(0);
let sRemaining = $derived(Math.max(0, Math.ceil(msRemaining / 1000)));

let lastAnimationFrame = <number | null>null;

const stopLoop = () => {
    if (lastAnimationFrame === null) return;
    cancelAnimationFrame(lastAnimationFrame);
    lastAnimationFrame = null;
}

$effect(() => {
    if (timerState.paused) {
        msRemaining = timerState.msRemainingAtLastStart - (Date.now() - timerState.lastStartedAt);
        stopLoop();
        return;
    }

    if (lastAnimationFrame !== null) return;

    lastAnimationFrame = requestAnimationFrame(checkTimerUpdate);
});

$effect(() => {
    msRemaining = timerState.timeLimit;
});

const checkTimerUpdate = () => {
    msRemaining = timerState.msRemainingAtLastStart - (Date.now() - timerState.lastStartedAt);

    lastAnimationFrame = requestAnimationFrame(checkTimerUpdate);
};
</script>

<auto-drop-timer-container
    class:paused={timerState.paused}
>
    <auto-drop-label>
        garbage in
    </auto-drop-label>

    <auto-drop-timer>
        <timer-number>
            {sRemaining}
        </timer-number>

        <timer-bg
            style:--timer-progress={msRemaining / timerState.timeLimit}
        >
            <timer-bg-pattern></timer-bg-pattern>

            <timer-number class="light">
                {sRemaining}
            </timer-number>
        </timer-bg>
    </auto-drop-timer>
</auto-drop-timer-container>

<style lang="scss">
auto-drop-timer-container {
    display: flex;
    flex-direction: column;

    transition: opacity 0.125s ease-in-out;
    &.paused {
        opacity: 0.3333333;
    }
    gap: 0.5rem;
}

auto-drop-label {
    font-size: 1.25rem;
}

auto-drop-timer {
    display: grid;
    align-items: stretch;
    justify-items: end;
    > * {
        grid-area: 1/1;
    }
}

timer-bg {
    display: grid;
    > * {
        grid-area: 1/1;
    }
    place-items: stretch;

    overflow: hidden;
    width: 8rem;
    --timer-pct: calc(100% * (1 - var(--timer-progress)));
    mask: linear-gradient(90deg, #0000 var(--timer-pct), #000 var(--timer-pct));
    background: var(--tile-green);
    outline: 4px solid var(--color-gray);
}

timer-bg-pattern {
    display: block;
    width: 100%;
    height: 100%;
    opacity: calc(1 - var(--timer-progress));
    background: var(--tile-yellow);
}

timer-number {
    font-size: 2.5rem;
    font-weight: 700;
    padding: 0.5rem;
    justify-self: end;
    // mix-blend-mode: difference;
    display: block;

    &.light {
        color: #fff;
    }
    position: relative;
}
</style>