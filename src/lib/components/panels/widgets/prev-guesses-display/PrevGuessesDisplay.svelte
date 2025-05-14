<script lang="ts">
    import { WORD_LENGTH } from "$lib/constants";
    import { roundState } from "$lib/state/roundState.svelte";
    import { uiState } from "$lib/state/uiState.svelte";
    import { MatchResult } from "$lib/types/MatchResult";
    import MiniWordRow from "./MiniWordRow.svelte";

const {
    guessResults,
    showFinalWord=false,
}: {
    guessResults: Iterable<{guess: string, matchResults: MatchResult[]}>,
    showFinalWord?: boolean,
} = $props();
</script>


<prev-guesses-grid class:paused={uiState().paused}>
    {#each guessResults as {guess, matchResults}, y}
        <MiniWordRow word={guess} {matchResults} {y} />
    {/each}
    
    {#if showFinalWord && uiState().gameOver}
        <MiniWordRow
            word={roundState.word}
            matchResults={new Array(WORD_LENGTH).fill(0).map(_ => MatchResult.Empty)}
            y={roundState.guessedWords.size}
        />
    {/if}
</prev-guesses-grid>


<style lang="scss">
prev-guesses-grid {
    transform-style: flat;
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 0.125rem;
    user-select: none;


    transition: opacity 0.125s ease-in-out;
    &.paused {
        opacity: 0;
    }
}
</style>