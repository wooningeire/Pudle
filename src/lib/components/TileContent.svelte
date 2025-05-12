<script lang="ts">
import {Tile, TileColor} from "$lib/types/Tile.ts";
    import { getTileTypeCssColor } from "$lib/types/tileColors.ts";
import { receive, send } from "#/transition.ts";
    import { backOut, bounceOut, cubicIn, cubicInOut, cubicOut, elasticOut, quadIn } from "svelte/easing";
    import { gameState, isFirstGuess } from "../state/gameState.svelte";
    import { roundState } from "../state/roundState.svelte";
    import { N_ROWS } from "../constants";
    import { uiState } from "../state/uiState.svelte";

const {
    tile,
    flipping = false,
    revealAnimationDelay = 0,
    x,
    y,
}: {
    tile: Tile,
    flipping?: boolean,
    revealAnimationDelay?: number,
    x: number,
    y: number,
} = $props();

const hasTab = $derived(tile.tagColor !== null && tile.tagColor !== tile.color);

const bgColor = $derived(getTileTypeCssColor(tile.color));
const tabColor = $derived(tile.tagColor !== null ? getTileTypeCssColor(tile.tagColor!) : bgColor);

const fallDistance = $derived(N_ROWS - gameState.board[x].length);
const transitionDuration = $derived((isFirstGuess() ? 1500 : 1250) * Math.sqrt(fallDistance / N_ROWS));

const isBlue = $derived(tile.color === TileColor.Blue);
</script>


<tile-content
    in:receive|global={{key: tile.id, easing: bounceOut, duration: transitionDuration, delay: x * 50}}
    out:send|global={{key: tile.id, easing: bounceOut, duration: transitionDuration, delay: x * 50}}
    class:flipping
    style:--bg-color={bgColor}
    class:has-tab={hasTab}
    style:--reveal-animation-delay="{revealAnimationDelay}ms"
    style:--tab-color={tabColor}
    class:is-first-guess={isFirstGuess()}
    class:blue={isBlue}
>
    <tile-content-bg-container>
        <tile-content-bg-mask>
            <tile-content-bg></tile-content-bg>
        </tile-content-bg-mask>

        <tile-flag></tile-flag>
    </tile-content-bg-container>

    <tile-text>{tile.letter}</tile-text>
</tile-content>


<style lang="scss">
tile-content {
    display: grid;
    place-items: center;
    color: #fff;

    > * {
        grid-area: 1/1;
    }

    backface-visibility: hidden;

    &.flipping {
        transform: rotateX(0.5turn);
        animation: flip-content 0.5s ease-in-out forwards;
        animation-delay: var(--reveal-animation-delay);

        &.is-first-guess {
            animation-duration: var(--tile-flip-duration-first-guess);
        }

        @keyframes flip-content {
            0% {
                transform: rotateX(0.5turn);
            }
            100% {
                transform: rotateX(0turn);
            }
        }
    }

    &.blue {
        transition:
            background .125s ease-in-out,
            color .125s ease-in-out,
            box-shadow .25s ease-in-out,
            border .25s ease-in-out;

        color: var(--tile-blue-dark);
        filter: drop-shadow(0 0.25rem 0.5rem var(--tile-blue));
    }
}

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

.blue tile-content-bg-container {
    outline: 2px solid var(--tile-blue);
}

tile-content-bg-mask {
    mask: linear-gradient(135deg, #000 80%, #0000 80%);

    display: grid;
    place-items: stretch;
}

tile-content-bg {
    background: var(--bg-color);
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

.blue tile-content-bg {
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

tile-text {
    position: relative;
}
</style>

