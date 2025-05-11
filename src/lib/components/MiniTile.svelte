<script lang="ts">
    import { cubicInOut } from "svelte/easing";
    import type { MatchResult } from "../types/MatchResult";
    import { getMatchResultCssColor } from "../types/tileColors";
    import { flipLeft, flipRight, halfFlipLeft, halfFlipRight } from "./transition";

const {
    letter = " ",
    matchResult,
    x,
    y,
}: {
    letter?: string,
    matchResult: MatchResult,
    x: number,
    y: number,
} = $props();

const bgColor = $derived(getMatchResultCssColor(matchResult));
</script>


<mini-tile
    style:background={bgColor}
    in:halfFlipLeft|global={{duration: 500, delay: x * 50, easing: cubicInOut}}
    out:halfFlipRight|global={{duration: 500, delay: x * 50 + y * 50, easing: cubicInOut}}
>{letter}</mini-tile>


<style lang="scss">
mini-tile {
    width: 1.25rem;
    height: 1.25rem;
    color: #fff;
    display: grid;
    place-items: center;
}
</style>