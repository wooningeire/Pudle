<script lang="ts">
import type { MatchResult } from "../types/MatchResult";
import MiniTile from "./MiniTile.svelte";

const {
    word,
    matchResults,
    y,
}: {
    word: string,
    matchResults: MatchResult[],
    y: number,
} = $props();
</script>

<mini-word-row>
    {#each word as letter, x}
        <MiniTile
            {letter}
            matchResult={matchResults[x]}
            {x}
            {y}
        />
    {/each}
</mini-word-row>

<style lang="scss">
mini-word-row {
    display: flex;
    gap: 0.125rem;
}
</style>