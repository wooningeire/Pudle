<script>
    import { fade } from "svelte/transition";
    import { ISLAND_SIZE_THRESHOLD } from "../constants";
    import { uiState } from "../state/uiState.svelte";
    import { MatchResult } from "../types/MatchResult";
    import { TileColor } from "../types/Tile";
    import MiniTile from "./MiniTile.svelte";
    import { cubicOut, elasticOut } from "svelte/easing";
    import { halfFlipLeft, halfFlipRight } from "./transition";

</script>
<instructions-text>
    <p>
        Create groups of {ISLAND_SIZE_THRESHOLD} <MiniTile tileColor={TileColor.Green} smaller />
        or {ISLAND_SIZE_THRESHOLD} <MiniTile tileColor={TileColor.Yellow} smaller />!
    </p>

    {#if uiState().discoveredBlueTiles}
        <p in:halfFlipLeft={{duration: 4000, easing: elasticOut}}>
            Click <MiniTile tileColor={TileColor.Blue} smaller /> to set its color or destroy nearby tiles!
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
    transform-origin: left;
}
</style>