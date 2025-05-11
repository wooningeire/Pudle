<script>
    import { gameState } from "../state/gameState.svelte";

</script>

<game-stats>
    {#key gameState.stats.nthWord}
        <game-stat class="nth-word">
            <stat-label>word</stat-label>
            <stat-number>{gameState.stats.nthWord}</stat-number>
        </game-stat>
    {/key}

    {#key gameState.stats.nthGuess}
        <game-stat class="nth-guess">
            <stat-label>guess</stat-label>
            <stat-number>{gameState.stats.nthGuess}</stat-number>
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

    animation: push-forward-label 0.75s ease-out;

    @keyframes push-forward-label {
        20% {
            transform: translateZ(2rem);
        }
    }
}

stat-number {
    font-size: 4rem;
    font-weight: 700;

    animation: push-forward-number 0.75s ease-out;
    animation-delay: 0.125s;

    @keyframes push-forward-number {
        20% {
            transform: translateZ(4rem);
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