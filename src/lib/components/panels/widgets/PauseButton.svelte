<script>
    import { pauseGame, uiState, unpauseGame } from "$lib/state/uiState.svelte";
    import Button from "./parts/Button.svelte";

const togglePaused = () => {
    if (!uiState().paused) {
        pauseGame();
    } else {
        unpauseGame();
    }

    return true;
}

</script>

<pause-button-container>
    <Button
        onClick={togglePaused}
        moveLeft
        disabled={uiState().gameOver || uiState().canTypeOrAffectBoard}
    >
        {#if !uiState().paused}
            pause
        {:else}
            resume
        {/if}
    </Button>
</pause-button-container>

<style lang="scss">
* {
    transform-style: preserve-3d;
}

pause-button-container {
    font-size: 1.5rem;
    align-self: center;
}
</style>