<script>
    import { elasticOut, quartOut } from "svelte/easing";
    import PrevGuessesDisplay from "./widgets/prev-guesses-display/PrevGuessesDisplay.svelte";
    import { fly } from "svelte/transition";
    import { flipRight, halfFlipLeft, halfFlipRight } from "#/transition";
    import Instructions from "./widgets/Instructions.svelte";
    import { flip } from "svelte/animate";
    import PauseButton from "./widgets/PauseButton.svelte";
    import { statsState } from "$lib/state/statsState.svelte";

</script>

<right-panel in:halfFlipLeft={{duration: 5000, easing: elasticOut, baseRot: "-35deg"}}>
    <right-panel-top>
        <Instructions />

        <PrevGuessesDisplay />
    </right-panel-top>

    <right-panel-bottom>
        <PauseButton />
    </right-panel-bottom>
</right-panel>




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
    justify-content: space-between;

    transform: rotateY(-35deg) scale(var(--scale-fac));
    transform-origin: left;
    backface-visibility: hidden;


    --scale-fac: 1;
    @media screen and (max-width: $small-width) {
        --scale-fac: 0.75;
    }
    // @media screen and (max-width: $xsmall-width) {
    //     display: none;
    // }
}

right-panel-top {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

right-panel-bottom {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}
</style>