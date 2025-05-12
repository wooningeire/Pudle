<script>
    import { elasticOut, quartOut } from "svelte/easing";
    import { isFirstGuess } from "../state/gameState.svelte";
    import PrevGuessesDisplay from "./PrevGuessesDisplay.svelte";
    import { fly } from "svelte/transition";
    import { flipRight, halfFlipLeft, halfFlipRight } from "./transition";
    import Instructions from "./Instructions.svelte";
    import { flip } from "svelte/animate";

</script>

{#if !isFirstGuess()}
    <right-panel in:halfFlipLeft={{duration: 5000, easing: elasticOut, baseRot: "-35deg"}}>
        <Instructions />

        <PrevGuessesDisplay />
    </right-panel>
{/if}




<style lang="scss">
@import "#/constants.scss";

* {
    transform-style: preserve-3d;
}

right-panel {
    grid-area: 2/3 / 4/4;
    place-self: stretch;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    transform: rotateY(-35deg) scale(var(--scale-fac));
    transform-origin: left;
    backface-visibility: hidden;


    --scale-fac: 1;
    @media screen and (max-width: $small-width) {
        --scale-fac: 0.75;
    }
    @media screen and (max-width: $xsmall-width) {
        display: none;
    }
}
</style>