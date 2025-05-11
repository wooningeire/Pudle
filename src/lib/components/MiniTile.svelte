<script lang="ts">
    import { cubicInOut } from "svelte/easing";
    import { MatchResult } from "../types/MatchResult";
    import { getMatchResultCssColor } from "../types/tileColors";
    import { flipLeft, flipRight, halfFlipLeft, halfFlipRight } from "./transition";

const {
    letter = " ",
    matchResult,
    x = 0,
    y = 0,
    smaller = false,
}: {
    letter?: string,
    matchResult: MatchResult,
    x?: number,
    y?: number,
    smaller?: boolean,
} = $props();

const bgColor = $derived(getMatchResultCssColor(matchResult));
</script>


<mini-tile
    style:background={bgColor}
    in:halfFlipLeft|global={{duration: 500, delay: x * 50, easing: cubicInOut}}
    out:halfFlipRight|global={{duration: 500, delay: x * 50 + y * 50, easing: cubicInOut}}
    class:smaller
    class:empty={matchResult === MatchResult.Empty}
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
}
</style>