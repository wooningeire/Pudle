<script lang="ts">
import {Tile, TileColor} from "$lib/types/Tile.ts";
    import { getTileTypeCssColor } from "$lib/types/tileColors.ts";
import { receive, send } from "#/transition.ts";
    import { cubicIn, cubicInOut, cubicOut, quadIn } from "svelte/easing";
    import { gameState, isFirstGuess } from "../state/gameState.svelte";

const {
    tile,
    flipping = false,
    revealAnimationDelay = 0,
}: {
    tile: Tile,
    flipping?: boolean,
    revealAnimationDelay?: number,
} = $props();

const hasTab = $derived(tile.currentWordColor !== null && tile.currentWordColor !== tile.color);

const bgColor = $derived(getTileTypeCssColor(tile.color));
const tabColor = $derived(tile.currentWordColor !== null ? getTileTypeCssColor(tile.currentWordColor!) : bgColor);

const transitionDuration = $derived(isFirstGuess() ? 1500 : 500);
</script>


<tile-content
    in:receive|global={{key: tile.id, easing: cubicInOut, duration: transitionDuration}}
    out:send|global={{key: tile.id, easing: cubicInOut, duration: transitionDuration}}
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
    z-index: 1;


    background: linear-gradient(135deg, var(--bg-color) 80%, #0000 80%, #0000 85%, var(--tab-color) 85%);
    background-repeat: no-repeat;
    background-size: 4.5rem 4.5rem;

    transition: background-position 0.25s cubic-bezier(.04,.64,.2,1.43);

    &:not(.has-tab) {
        background-position: 0;
    }
    &.has-tab {
        background-position: -1.25rem -1.25rem;
    }

    &.flipping {
        opacity: 0;
        transform: rotateX(90deg);
        animation: flip-content 0.5s ease-out forwards;
        animation-delay: var(--reveal-animation-delay);

        &.is-first-guess {
            animation-duration: var(--tile-flip-duration-first-guess);
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


}
</style>

