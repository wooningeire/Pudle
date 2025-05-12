<script>
    import { fade } from "svelte/transition";
    import { ISLAND_SIZE_THRESHOLD } from "$lib/constants";
    import { uiState } from "$lib/state/uiState.svelte";
    import { MatchResult } from "$lib/types/MatchResult";
    import { TileColor } from "$lib/types/Tile";
    import MiniTile from "./parts/MiniTile.svelte";
    import { cubicOut, elasticOut } from "svelte/easing";
    import { flipLeft, halfFlipLeft, halfFlipRight } from "#/transition";

</script>
<instructions-text>
    <p>
        Create groups of {ISLAND_SIZE_THRESHOLD} <MiniTile tileColor={TileColor.Green} smaller />
        or {ISLAND_SIZE_THRESHOLD} <MiniTile tileColor={TileColor.Yellow} smaller />!
    </p>

    {#if uiState().discoveredBlueTiles}
        <p in:halfFlipRight={{duration: 4000, easing: elasticOut}}>
            Click a <MiniTile tileColor={TileColor.Blue} smaller /> to choose how it destroys tiles!
        </p>
    {/if}

    <!-- <p>
        Groups will destroy nearby <MiniTile matchResult={MatchResult.Absent} smaller />!
    </p>

    <p>
        If the timer runs out, more <MiniTile matchResult={MatchResult.Absent} smaller /> will drop!
    </p> -->
</instructions-text>

<style lang="scss">
* {
    transform-style: preserve-3d;
}

instructions-text {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

p {
    margin: 0;
    backface-visibility: hidden;
}
</style>