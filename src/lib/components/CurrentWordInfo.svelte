<script>
    import { gameState } from "$lib/state/gameState.svelte.ts";

</script>

<current-word-info>
    {#each gameState.guessedWordsThisRound as word}
        <prev-guess>{word}</prev-guess>
    {/each}
</current-word-info>




<style lang="scss">
current-word-info {
    grid-area: 1/3 / 3/4;
    align-self: start;
    justify-self: start;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}
</style>