<script>
    import { roundState } from "../state/roundState.svelte";
    import { uiState } from "../state/uiState.svelte";
    import { MatchResult } from "../types/MatchResult";
    import MiniWordRow from "./MiniWordRow.svelte";

</script>


<prev-guesses-grid>
    {#each roundState.guessedWords as [word, matchResults], y}
        <MiniWordRow {word} {matchResults} {y} />
    {/each}
    
    {#if uiState.gameOver}
        <MiniWordRow
            word={roundState.word}
            matchResults={new Array(5).fill(0).map(_ => MatchResult.Empty)}
            y={roundState.guessedWords.size}
        />
    {/if}
</prev-guesses-grid>


<style lang="scss">
prev-guesses-grid {
    display: flex;
    flex-direction: column;
    gap: 0.125rem;
    user-select: none;
}
</style>