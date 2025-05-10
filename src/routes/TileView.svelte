<script lang="ts">
import { fade } from "svelte/transition";
import {Tile, TileType} from "./Tile.ts";
import { receive, send } from "./transition.ts";
    import { cubicIn, cubicInOut, cubicOut, quadIn } from "svelte/easing";
    import { flip } from "svelte/animate";

const {
    tile,
    isInputRow = false,
    isFlipping = false,
    revealAnimationDelay = 0,
}: {
    tile: Tile | null,
    isInputRow?: boolean,
    isFlipping?: boolean,
    revealAnimationDelay?: number,
} = $props();
</script>


<tile-view
    class:revealing={isFlipping}
    style:--reveal-animation-delay={`${revealAnimationDelay}ms`}
>
    <tile-bg
        class:filled={isInputRow && (tile?.letter.length ?? 0) > 0}
    >
        {#if tile !== null && isInputRow}
            <span transition:fade={{duration: 50}}>{tile.letter}</span>
        {/if}
    </tile-bg>

    {#if tile !== null && !isInputRow}
        <tile-content
            in:receive={{key: tile.id, easing: cubicInOut, duration: 500}}
            class:empty={tile.type === TileType.Empty}
            class:green={tile.type === TileType.Green}
            class:yellow={tile.type === TileType.Yellow}
            class:gray={tile.type === TileType.Gray}
        >
            {tile.letter}
        </tile-content>
    {/if}

    {#if tile !== null && isInputRow && isFlipping}
        <tile-content
            in:receive={{key: tile.id, easing: cubicInOut, duration: 500}}
            out:send={{key: tile.id, easing: cubicInOut, duration: 500}}
            class:empty={tile.type === TileType.Empty}
            class:green={tile.type === TileType.Green}
            class:yellow={tile.type === TileType.Yellow}
            class:gray={tile.type === TileType.Gray}
        >
            {tile.letter}
        </tile-content>
    {/if}
</tile-view>

<style lang="scss">
tile-view {
    width: 3rem;
    height: 3rem;
    font-size: 2rem;
    display: grid;
    place-items: stretch;

    > * {
        grid-area: 1/1;
    }
}

tile-bg {
    display: grid;
    place-items: center;

    transition:
        outline 0.125s ease-in-out,
        outline-offset 0.075s ease-in-out;
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
}


tile-content {
    display: grid;
    place-items: center;
    color: #fff;

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

.revealing {
    tile-bg {
        opacity: 1;
        transform: rotateX(0deg);
        animation: flip-bg 0.5s ease-in forwards;
        animation-delay: var(--reveal-animation-delay);
    }
    tile-content {
        opacity: 0;
        transform: rotateX(90deg);
        animation: flip-content 0.5s ease-out forwards;
        animation-delay: var(--reveal-animation-delay);
    }
    
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

    @keyframes flip-content {
        0% {
            opacity: 0;
        }
        49.99999% {
            opacity: 0;
        }
        50% {
            opacity: 1;
            transform: rotateX(90deg);
        }
        100% {
            opacity: 1;
            transform: rotateX(0deg);
        }
    }
}
</style>

