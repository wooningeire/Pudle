<script lang="ts">
import {Tile, TileColor} from "$lib/types/Tile.ts";
import TileContent from "#/TileContent.svelte";
    import { fade, type TransitionConfig } from "svelte/transition";
    import { cubicOut } from "svelte/easing";

const {
    tile,
    x = null,
}: {
    tile: Tile,
    x?: number | null,
} = $props();

const explode = (node: HTMLElement, params: TransitionConfig, options: {direction: "in" | "out" | "both"}) => {
    return {
        ...params,
        css: (t: number, u: number) => `transform: scale(${1.5 - t * 0.5}); opacity: ${t};`,
    };
};
</script>


<tile-view
    out:explode|global={{duration: 500, easing: cubicOut}}
>
    <TileContent
        {tile}
        x={x ?? 0}
    />
</tile-view>

<style lang="scss">
@import "#/mixins.scss";
tile-view {
    @include tile;
    display: grid;
    place-items: stretch;

    transform-style: preserve-3d;

    > :global(*) {
        grid-area: 1/1;
    }
}
</style>