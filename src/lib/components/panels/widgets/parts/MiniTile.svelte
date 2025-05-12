<script lang="ts">
    import { cubicInOut } from "svelte/easing";
    import { MatchResult } from "$lib/types/MatchResult";
    import { getMatchResultCssColor, getTileTypeCssColor } from "$lib/types/tileColors";
    import { flipLeft, flipRight, halfFlipLeft, halfFlipRight } from "#/transition";
    import { EMPTY_TILE_CHAR } from "$lib/constants";
    import { TileColor } from "$lib/types/Tile";

const {
    letter = EMPTY_TILE_CHAR,
    tileColor,
    x = 0,
    y = 0,
    smaller = false,
}: {
    letter?: string,
    tileColor: TileColor,
    x?: number,
    y?: number,
    smaller?: boolean,
} = $props();

const bgColor = $derived(getTileTypeCssColor(tileColor));
</script>


<mini-tile
    style:background={bgColor}
    in:halfFlipLeft|global={{duration: 500, delay: x * 50, easing: cubicInOut}}
    out:halfFlipRight|global={{duration: 500, delay: x * 50 + y * 50, easing: cubicInOut}}
    class:smaller
    class:empty={tileColor === TileColor.Empty}
    class:blue={tileColor === TileColor.Blue}
>{letter}</mini-tile>


<style lang="scss">
mini-tile {
    width: 1.25rem;
    height: 1.25rem;
    display: inline-grid;
    vertical-align: middle;
    place-items: center;
    line-height: 0.8;

    &.smaller {
        width: 1rem;
        height: 1rem;
    }

    &:not(.empty) {
        color: #fff;
    }

    &.empty {
        border: 1px solid #aaa;
    }

    &.blue {
        background: var(--tile-blue-bg);
        box-shadow:
            0 0 0 2px var(--tile-blue) inset,
            0 0.125rem 0.25rem var(--tile-blue);
        color: var(--tile-blue-dark);
    }
}
</style>