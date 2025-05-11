<script>
    import { gameState, isFirstGuess } from "$lib/state/gameState.svelte.ts";

</script>


<game-status class:hidden={isFirstGuess()}>
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
</game-status>


<style lang="scss">
game-status {
    grid-area: 1/1 / 3/2;
    align-self: start;
    justify-self: end;
    display: flex;
    flex-direction: column;
    gap: 3rem;

    text-align: right;
    line-height: 0.8;


    transition: opacity 2s ease-in-out;
    &.hidden {
        opacity: 0;
    }

    transform: rotateY(25deg);
    transform-origin: right;
}

game-stat {
    display: flex;
    flex-direction: column;
}

stat-label {
    font-size: 2rem;
}
stat-number {
    font-size: 4rem;
}

.nth-word {
    animation: pulse-green 1s ease-out;

    @keyframes pulse-green {
        0% {
            color: #fff;
            text-shadow: 0 0 1rem var(--tile-green);
        }
        50% {
            color: var(--tile-green);
            text-shadow: 0 0 01rem #0000;
        }
    }
}

.nth-guess {
    animation: pulse-yellow 1s ease-out;

    @keyframes pulse-yellow {
        0% {
            color: #fff;
            text-shadow: 0 0 1rem var(--tile-yellow);
        }
        50% {
            color: var(--tile-yellow);
            text-shadow: 0 0 1rem #0000;
        }
    }
}
</style>