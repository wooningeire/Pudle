<script lang="ts">
import {Tile, TileColor} from "$lib/types/Tile.ts";
    import { getTileTypeCssColor } from "$lib/types/tileColors.ts";
import { receive, send } from "#/transition.ts";
    import { backOut, bounceOut, cubicIn, cubicInOut, cubicOut, elasticOut, quadIn } from "svelte/easing";
    import { boardState, hashPoint } from "$lib/state/boardState.svelte";
    import { roundState } from "$lib/state/roundState.svelte";
    import { N_ROWS } from "$lib/constants";
    import { uiState } from "$lib/state/uiState.svelte";
    import TileContentBg from "./TileContentBg.svelte";
    import { keyboardClick } from "#/event";
    import { isFirstGuess } from "$lib/state/statsState.svelte";

const {
    tile,
    flipping = false,
    revealAnimationDelay = 0,
    isInputRow = false,
    x,
    y,
}: {
    tile: Tile,
    flipping?: boolean,
    revealAnimationDelay?: number,
    isInputRow?: boolean,
    x: number,
    y: number,
} = $props();

const hasTab = $derived(tile.tagColor !== null && tile.tagColor !== tile.color);

const bgColor = $derived(getTileTypeCssColor(tile.color));
const tabColor = $derived(tile.tagColor !== null ? getTileTypeCssColor(tile.tagColor!) : bgColor);

const fallDistance = $derived(N_ROWS - boardState.board[x].length);
const transitionDuration = $derived((isFirstGuess() ? 1500 : 1250) * Math.sqrt(fallDistance / N_ROWS));


const isBlue = $derived(tile.color === TileColor.Blue);

const isSelectingBlueTile = $derived(isInputRow && uiState().selectingBlueTile);

const selectBlueTile = () => {
    if (!isSelectingBlueTile) return;
    uiState().currentBlueTileSelectionResolver!(x);
};

const inDestroyRange = $derived(uiState().previewRange?.has(hashPoint({x, y})) ?? false);
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
    onclick={selectBlueTile}
    onkeydown={keyboardClick(selectBlueTile)}
    class:selecting-blue-tile={isSelectingBlueTile}
    tabindex={isSelectingBlueTile ? 0 : -1}
    class:hidden={uiState().paused}
    class:in-destroy-range={inDestroyRange}
>
    <TileContentBg {tile} />

    <tile-text>{tile.letter}</tile-text>
</tile-content>


<style lang="scss">
tile-content {
    display: grid;
    place-items: center;
    color: #fff;

    backface-visibility: hidden;
    transition:
        filter .125s ease-in-out,
        transform .25s cubic-bezier(0.175, 0.885, 0.32, 1.275),
        background .125s ease-in-out,
        color .125s ease-in-out,
        box-shadow .25s ease-in-out,
        border .25s ease-in-out,
        opacity 0.125s ease-in-out;

    filter: none;

    > :global(*) {
        grid-area: 1/1;
    }

    &.flipping:not(.selecting-blue-tile) {
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
        color: var(--tile-blue-dark);
        filter: drop-shadow(0 0.25rem 0.5rem var(--tile-blue));
    }

    &.selecting-blue-tile {
        cursor: pointer;
        pointer-events: all;

        &:hover,
        &:focus {
            transform: scale(1.125);
            filter: brightness(1.25);
        }

        &:active {
            filter: brightness(0.85);
        }
    }
    &.hidden {
        opacity: 0;
    }

    &.in-destroy-range {
        filter: sepia(1) hue-rotate(105deg) saturate(2);
    }
}


tile-text {
    position: relative;
}
</style>

