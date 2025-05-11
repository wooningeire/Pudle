<script lang="ts">
import {Tile, TileColor} from "$lib/types/Tile.ts";
    import { getTileTypeCssColor } from "$lib/types/tileColors.ts";
import { receive, send } from "#/transition.ts";
    import { backOut, bounceOut, cubicIn, cubicInOut, cubicOut, elasticOut, quadIn } from "svelte/easing";
    import { gameState, isFirstGuess } from "../state/gameState.svelte";
    import { roundState } from "../state/roundState.svelte";
    import { N_ROWS } from "../constants";

const {
    tile,
    flipping = false,
    revealAnimationDelay = 0,
    x,
}: {
    tile: Tile,
    flipping?: boolean,
    revealAnimationDelay?: number,
    x: number,
} = $props();

const hasTab = $derived(tile.tagColor !== null && tile.tagColor !== tile.color);

const bgColor = $derived(getTileTypeCssColor(tile.color));
const tabColor = $derived(tile.tagColor !== null ? getTileTypeCssColor(tile.tagColor!) : bgColor);

const fallDistance = $derived(N_ROWS - gameState.board[x].length);
const transitionDuration = $derived((isFirstGuess() ? 1500 : 1250) * Math.sqrt(fallDistance / N_ROWS));
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
>
    <div>{tile.letter}</div>
</tile-content>


<style lang="scss">
@import "#/mixins.scss";

tile-content {
    display: grid;
    place-items: center;
    color: #fff;

    background: linear-gradient(135deg, var(--bg-color) 80%, #0000 80%, #0000 82.5%, var(--tab-color) 82.5%);
    background-repeat: no-repeat;
    background-size: 5rem 5rem;

    transition: background-position 0.25s cubic-bezier(.04,.64,.2,1.43);

    backface-visibility: hidden;

    &:not(.has-tab) {
        background-position: -0.5rem -0.5rem;
    }
    &.has-tab {
        background-position: -1.75rem -1.75rem;
    }

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


}
</style>

