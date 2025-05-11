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
}
stat-number {
    font-size: 4rem;
    font-weight: 700;
}

.nth-word {
    animation: pulse-green 1s linear;

    @keyframes pulse-green {
        0% {
            color: var(--tile-green);
        }
    }
}

.nth-guess {
    animation: pulse-yellow 1s linear;

    @keyframes pulse-yellow {
        0% {
            color: var(--tile-yellow);
        }
    }
}
</style>