<script lang="ts">
import {Tile} from "./Tile";
import TileView from "./TileView.svelte";

const {
    tiles,
}: {
    tiles: Tile[],
} = $props();
</script>

<tile-row>
    {#each tiles as tile}
        <TileView {tile} />
    {/each}
</tile-row>

<style lang="scss">
tile-row {
    display: flex;
    gap: 0.5rem;
}
</style>