<script>
    import { roundState } from "../state/roundState.svelte";
    import MiniWordRow from "./MiniWordRow.svelte";

</script>


<prev-guesses-grid>
    {#each roundState.guessedWords as [word, matchResults], y}
        <MiniWordRow {word} {matchResults} {y} />
    {/each}
</prev-guesses-grid>


<style lang="scss">
prev-guesses-grid {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    user-select: none;
}
</style>