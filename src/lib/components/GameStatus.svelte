<script>
    import { gameState } from "$lib/state/gameState.svelte.ts";

</script>


<game-status>
    <game-stat>
        <stat-label>word</stat-label>
        <stat-number>{gameState.stats.nWordsFound + 1}</stat-number>
    </game-stat>

    <game-stat>
        <stat-label>guess</stat-label>
        <stat-number>{gameState.stats.nGuessesMade + 1}</stat-number>
    </game-stat>
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
</style>