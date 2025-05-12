<script>
import { gameState, isFirstGuess } from "$lib/state/gameState.svelte.ts";
    import { fly } from "svelte/transition";
import { uiState } from "../state/uiState.svelte";
import Button from "./Button.svelte";
import GameOverOptions from "./GameOverOptions.svelte";
import GameStats from "./GameStats.svelte";
    import { elasticOut, quartOut } from "svelte/easing";
    import { flipLeft, halfFlipLeft, halfFlipRight } from "./transition";
    import AutoDropTimer from "./AutoDropTimer.svelte";
</script>


{#if !isFirstGuess()}
    <left-panel in:halfFlipRight={{duration: 5000, easing: elasticOut, baseRot: "35deg"}}>
        <GameStats />

        <AutoDropTimer />

        {#if uiState.gameOver}
            <GameOverOptions />
        {/if}
    </left-panel>
{/if}


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
    @media screen and (max-width: $xsmall-width) {
        display: none;
    }

    text-align: right;
    line-height: 0.8;
}
</style>