<script>
    import { quartOut } from "svelte/easing";
    import { isFirstGuess } from "../state/gameState.svelte";
    import PrevGuessesDisplay from "./PrevGuessesDisplay.svelte";
    import { fly } from "svelte/transition";

</script>

{#if !isFirstGuess()}
    <right-panel in:fly={{duration: 2000, easing: quartOut}}>
        <PrevGuessesDisplay />
    </right-panel>
{/if}




<style lang="scss">
@import "#/constants.scss";
right-panel {
    grid-area: 2/3 / 4/4;
    place-self: stretch;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 1.5rem;

    transform: rotateY(-35deg) scale(var(--scale-fac));
    transform-origin: left;


    --scale-fac: 1;
    @media screen and (max-width: $small-width) {
        --scale-fac: 0.75;
    }
    @media screen and (max-width: $xsmall-width) {
        display: none;
    }
}
</style>