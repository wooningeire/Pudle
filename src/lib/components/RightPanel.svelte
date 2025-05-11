<script>
    import { isFirstGuess } from "../state/gameState.svelte";
    import { roundState } from "../state/roundState.svelte";
    import PrevGuessesDisplay from "./PrevGuessesDisplay.svelte";

</script>

<right-panel class:hidden={isFirstGuess()}>
    <PrevGuessesDisplay />
</right-panel>




<style lang="scss">
@import "#/constants.scss";
right-panel {
    grid-area: 1/3 / 3/4;
    align-self: start;
    justify-self: start;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    transition: opacity 2s ease-in-out;

    &.hidden {
        opacity: 0;
    }

    transform: rotateY(-25deg) scale(var(--scale-fac));
    transform-origin: left;


    --scale-fac: 1;
    @media screen and (max-width: $small-view) {
        --scale-fac: 0.75;
    }
    @media screen and (max-width: $xsmall-view) {
        display: none;
    }
}
</style>