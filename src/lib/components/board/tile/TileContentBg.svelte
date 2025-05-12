<script lang="ts">
import { TileColor, type Tile } from "$lib/types/Tile";

const {
    tile,
}: {
    tile: Tile,
} = $props();

const blue = $derived(tile.color === TileColor.Blue);
const hasTab = $derived(tile.tagColor !== null && tile.tagColor !== tile.color);
</script>


<tile-content-bg-container
    class:blue
    class:has-tab={hasTab}
>
    <tile-content-bg-mask>
        <tile-content-bg class:blue></tile-content-bg>

        {#if blue}
            <tile-content-border></tile-content-border>
        {/if}
    </tile-content-bg-mask>

    <tile-flag></tile-flag>
</tile-content-bg-container>

<style lang="scss">
tile-content-bg-container {
    place-self: stretch;
    display: grid;
    width: var(--tile-size);
    height: var(--tile-size);
    place-items: stretch;
    overflow: hidden;
    > * {
        width: var(--tile-size);
        height: var(--tile-size);
        grid-area: 1/1;
    }
}

tile-content-bg-mask {
    mask: linear-gradient(135deg, #000 80%, #0000 80%);

    display: grid;
    place-items: stretch;

    > * {
        grid-area: 1/1;
    }
}

tile-content-bg {
    background: var(--bg-color);

    &.blue {
        width: 5rem;
        height: 5rem;
        margin-top: calc((5rem - var(--tile-size)) / -2);
        margin-left: calc((5rem - var(--tile-size)) / -2);
        background: var(--tile-blue-bg);
        animation: background-spin 5s infinite linear;

        @keyframes background-spin {
            100% {
                transform: rotate(1turn);
            }
        }
    }
}

tile-content-border {
    display: block;
    width: var(--tile-size);
    height: var(--tile-size);
    box-shadow: 0 0 0 0.25rem var(--tile-blue) inset;
    position: relative;
}

tile-flag {
    background: var(--tab-color);
    mask: linear-gradient(135deg, #0000 82.5%, #000 82.5%);
    position: relative;
}

tile-content-bg-mask,
tile-flag {
    mask-repeat: no-repeat;
    mask-size: 5rem 5rem;
}

:not(.has-tab) :is(tile-content-bg-mask, tile-flag) {
    transition: mask-position 0.25s cubic-bezier(.35,0,0.6,.45);

    mask-position: -0.5rem -0.5rem;
}
.has-tab :is(tile-content-bg-mask, tile-flag) {
    transition: mask-position 0.25s cubic-bezier(.04,.64,.2,1.43);

    mask-position: -1.75rem -1.75rem;
}
</style>