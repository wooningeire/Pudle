<script lang="ts">
import {Tile, TileType} from "./Tile.ts";
import { receive, send } from "./transition.ts";
    import { cubicIn, cubicInOut, cubicOut, quadIn } from "svelte/easing";

const {
    tile,
    flipping = false,
    revealAnimationDelay = 0,
}: {
    tile: Tile,
    flipping?: boolean,
    revealAnimationDelay?: number,
} = $props();
</script>


<tile-content
    in:receive|global={{key: tile.id, easing: cubicInOut, duration: 500}}
    out:send|global={{key: tile.id, easing: cubicInOut, duration: 500}}
    class:flipping
    class:green={tile.type === TileType.Green}
    class:yellow={tile.type === TileType.Yellow}
    class:gray={tile.type === TileType.Gray}
    style:--reveal-animation-delay="{revealAnimationDelay}ms"
>
    {tile.letter}
</tile-content>


<style lang="scss">
@import "./mixins.scss";

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

    &.flipping {
        opacity: 0;
        transform: rotateX(90deg);
        animation: flip-content 0.5s ease-out forwards;
        animation-delay: var(--reveal-animation-delay);

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

