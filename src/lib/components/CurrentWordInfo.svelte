<script>
    import { isFirstGuess } from "../state/gameState.svelte";
    import { roundState } from "../state/roundState.svelte";

</script>

<current-word-info class:hidden={isFirstGuess()}>
    {#each roundState.guessedWords as [word, matchResults]}
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

    transition: opacity 2s ease-in-out;

    &.hidden {
        opacity: 0;
    }
}
</style>