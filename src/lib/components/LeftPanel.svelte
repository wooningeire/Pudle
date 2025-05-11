<script>
import { gameState, isFirstGuess } from "$lib/state/gameState.svelte.ts";
    import { fly } from "svelte/transition";
import { uiState } from "../state/uiState.svelte";
import Button from "./Button.svelte";
import GameOverOptions from "./GameOverOptions.svelte";
import GameStats from "./GameStats.svelte";
    import { quartOut } from "svelte/easing";
</script>


{#if !isFirstGuess()}
    <left-panel in:fly={{duration: 2000, easing: quartOut}}>
        <GameStats />

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
    justify-content: space-between;

    transform: rotateY(35deg) scale(var(--scale-fac));
    transform-origin: right;

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