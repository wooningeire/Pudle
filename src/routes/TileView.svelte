<script lang="ts">
    import { fade } from "svelte/transition";
import {Tile, TileType} from "./Tile.ts";

const {
    tile,
}: {
    tile: Tile,
} = $props();
</script>

<single-tile
    class:has-letter={tile.letter.length > 0}
    class:empty={tile.type === TileType.Empty}
    class:green={tile.type === TileType.Green}
    class:yellow={tile.type === TileType.Yellow}
    class:gray={tile.type === TileType.Gray}
>
    {#if tile.letter.length > 0}
        <span transition:fade={{duration: 50}}>{tile.letter}</span>
    {/if}
</single-tile>

<style lang="scss">
single-tile {
    display: block;
    width: 3rem;
    height: 3rem;
    font-size: 2rem;
    display: grid;
    place-items: center;

    &.empty {
        transition:
            outline 0.125s ease-in-out,
            outline-offset 0.075s ease-in-out;
        outline: 2px solid #aaa;
        outline-offset: -0.5rem;
    }

    &.has-letter.empty {
        outline: 2px solid #333;
        outline-offset: 0;
        animation: pulse .175s ease-in-out;
        @keyframes pulse {
            20% {
                transform: scale(1.125);
            }
        }
    }

    &:not(.empty) {
        color: #fff;
    }

    &.green {
        background: #66a166;
    }

    &.yellow {
        background: #bbb660;
    }

    &.gray {
        background: #7c7c81;
    }
}
</style>

