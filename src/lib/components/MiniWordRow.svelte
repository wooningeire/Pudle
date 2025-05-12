<script lang="ts">
import { MatchResult } from "../types/MatchResult";
    import { TileColor } from "../types/Tile";
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

const resultsToColors = new Map([
    [MatchResult.Empty, TileColor.Empty],
    [MatchResult.Absent, TileColor.Gray],
    [MatchResult.Misplaced, TileColor.Yellow],
    [MatchResult.Match, TileColor.Green],
]);
</script>

<mini-word-row>
    {#each word as letter, x}
        <MiniTile
            {letter}
            tileColor={resultsToColors.get(matchResults[x])!}
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