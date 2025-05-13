<script>
import { uiState } from "$lib/state/uiState.svelte";
import GameOverOptions from "./widgets/GameOverOptions.svelte";
import GameStats from "./widgets/GameStats.svelte";
    import { elasticOut, quartOut } from "svelte/easing";
    import { flipLeft, halfFlipLeft, halfFlipRight } from "#/transition";
    import GarbageDropTimer from "./widgets/GarbageDropTimer.svelte";
    import { statsState } from "$lib/state/statsState.svelte";
</script>


<left-panel in:halfFlipRight={{duration: 5000, easing: elasticOut, baseRot: "35deg"}}>
    <GameStats />

    <GarbageDropTimer />

    {#if uiState().gameOver}
        <GameOverOptions />
    {/if}
</left-panel>


<style lang="scss">
@import "#/constants.scss";

left-panel {
    grid-area: 2/1 / 4/2;
    place-self: stretch;
    display: flex;
    flex-direction: column;
    align-items: end;
    gap: 3rem;

    transform: rotateY(35deg) scale(var(--scale-fac));
    transform-origin: right;
    backface-visibility: hidden;
    
    transform-style: preserve-3d;

    --scale-fac: 1;
    @media screen and (max-width: $small-width) {
        --scale-fac: 0.75;
    }
    // @media screen and (max-width: $xsmall-width) {
    //     display: none;
    // }

    text-align: right;
    line-height: 0.8;
}
</style>