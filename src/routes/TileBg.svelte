<script lang="ts">
import { fade } from "svelte/transition";
import {Tile} from "./Tile.ts";
    import TileContent from "./TileContent.svelte";
    import { N_ROWS } from "./constants.ts";

const {
    tile = null,
    isInputRow = false,
    flipping = false,
    revealAnimationDelay = 0,
    hidden = false,
    x = null,
    y = null,
}: {
    tile?: Tile | null,
    isInputRow?: boolean,
    flipping?: boolean,
    revealAnimationDelay?: number,
    hidden?: boolean,
    x?: number | null,
    y?: number | null,
} = $props();
</script>


<tile-bg-container style:grid-area={x !== null && y !== null ? `${N_ROWS - y}/${x + 1}` : ""}>
    <tile-bg
        class:filled={isInputRow && (tile?.letter.length ?? 0) > 0}
        class:flipping
        class:hidden
        style:--reveal-animation-delay="{revealAnimationDelay}ms"
    >
        {#if tile !== null && isInputRow}
            <span transition:fade={{duration: 50}}>{tile.letter}</span>
        {/if}
    </tile-bg>


    {#if tile !== null && isInputRow && flipping}
        <TileContent
            {tile}
            {flipping}
            {revealAnimationDelay}
        />
    {/if}
</tile-bg-container>


<style lang="scss">
@import "./mixins.scss";

tile-bg-container {
    @include tile;

    display: grid;
    place-items: stretch;

    > :global(*) {
        grid-area: 1/1;
    }
}

tile-bg {
    display: grid;
    place-items: center;

    transition:
        outline 0.125s ease-in-out,
        outline-offset 0.075s ease-in-out,
        opacity 0.175s ease-in-out;
    outline: 2px solid #aaa;
    outline-offset: -0.5rem;

    &.filled {
        outline: 2px solid #333;
        outline-offset: 0;
        animation: pulse .175s ease-in-out;
        @keyframes pulse {
            20% {
                transform: scale(1.125);
            }
        }
    }

    &.hidden {
        opacity: 0;
        transition-delay: 0.25s;
    }

    &.flipping {
        opacity: 1;
        transform: rotateX(0deg);
        animation: flip-bg 0.5s ease-in forwards;
        animation-delay: var(--reveal-animation-delay);
        
        @keyframes flip-bg {
            0% {
                opacity: 1;
                transform: rotateX(0deg);
            }
            50% {
                opacity: 1;
                transform: rotateX(-90deg);
            }
            50.00001% {
                opacity: 0;
            }
            100% {
                opacity: 0;
            }
        }
    }
}
    
</style>

