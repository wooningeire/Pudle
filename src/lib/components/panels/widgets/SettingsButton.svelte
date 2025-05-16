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
        moveDirection="left"
        disabled={uiState().boardsLocked}
    >
        {#if !uiState().paused}
            settings
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