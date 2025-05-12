<script>
    import { pauseGame, uiState, unpauseGame } from "../state/uiState.svelte";
    import Button from "./Button.svelte";

const togglePaused = () => {
    if (!uiState().paused) {
        pauseGame();
    } else {
        unpauseGame();
    }

    return true;
}

</script>

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