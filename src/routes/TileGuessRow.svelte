<script lang="ts">
import {backspaceGuess, consumeGuess, extendGuess, uiState} from "./uiState.svelte.ts";
import TileView from "./TileView.svelte";


const keydown = (event: KeyboardEvent) => {
    if (event.ctrlKey || event.altKey) return;

    let key = event.key;

    switch (key) {
        case "Backspace":
            backspaceGuess();
            return;
        
        case "Enter":
            consumeGuess();
            return;
    }

    if (key.length !== 1) return;

    key = key.toUpperCase();
    if (!"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").includes(key)) return;

    extendGuess(key);
};
</script>


<svelte:window onkeydown={keydown} />

<tile-row>
    {#each uiState.guessTiles as tile, i}
        <TileView
            {tile}
            isInputRow
            isFlipping={uiState.isFlipping}
            revealAnimationDelay={i * 100}
        />
    {/each}
</tile-row>

<style lang="scss">
tile-row {
    display: flex;
    gap: 0.5rem;
}
</style>