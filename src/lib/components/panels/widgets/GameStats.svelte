<script>
    import { boardState } from "$lib/state/boardState.svelte";
    import { statsState } from "$lib/state/statsState.svelte";

</script>

<game-stats>
    {#key statsState.nthWord}
        <game-stat class="nth-word">
            <stat-label>word</stat-label>
            <stat-number>{statsState.nthWord}</stat-number>
        </game-stat>
    {/key}

    {#key statsState.nthGuess}
        <game-stat class="nth-guess">
            <stat-label>guess</stat-label>
            <stat-number>{statsState.nthGuess}</stat-number>
        </game-stat>
    {/key}
</game-stats>

<style lang="scss">
* {
    transform-style: preserve-3d;
}

game-stats {
    display: flex;
    flex-direction: column;
    gap: 3rem;
}

game-stat {
    display: flex;
    flex-direction: column;
}

stat-label {
    font-size: 2rem;

    animation: push-forward-label 0.5s ease-out;

    @keyframes push-forward-label {
        20% {
            transform: translateZ(2rem);
        }
    }
}

stat-number {
    font-size: 4rem;
    font-weight: 700;

    animation: push-forward-number 0.5s ease-out;
    animation-delay: 0.125s;

    @keyframes push-forward-number {
        20% {
            transform: translateZ(3rem);
        }
    }
}

.nth-word {
    animation: flash-green 1s ease-out;

    @keyframes flash-green {
        0% {
            color: var(--tile-green);
        }
    }
}

.nth-guess {
    animation: flash-yellow 1s ease-out;

    @keyframes flash-yellow {
        0% {
            color: var(--tile-yellow);
        }
    }
}

</style>