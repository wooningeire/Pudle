<script lang="ts">
    import type { MatchResult } from "../types/MatchResult";
    import { getMatchResultCssColor } from "../types/tileColors";

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


const flipLeft = (node: HTMLElement, {duration, delay}: {duration: number, delay: number}) => {
    return {
        duration,
        delay,
        css: (t: number, u: number) => `transform: rotateY(${u * 0.25}turn);`,
    };
};

const flipRight = (node: HTMLElement, {duration, delay}: {duration: number, delay: number}) => {
    return {
        duration,
        delay,
        css: (t: number, u: number) => `transform: rotateY(-${u * 0.25}turn);`,
    };
};
</script>


<mini-tile
    style:background={bgColor}
    in:flipLeft|global={{duration: 500, delay: x * 50}}
    out:flipRight|global={{duration: 500, delay: x * 50 + y * 50}}
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