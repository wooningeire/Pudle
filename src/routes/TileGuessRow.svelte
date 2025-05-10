<script lang="ts">
import {backspaceGuess, consumeGuess, extendGuess, uiState } from "$lib/state/uiState.svelte.ts";
import TileBg from "./TileBg.svelte";


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

{#each uiState.guessTiles as tile, i}
    <TileBg
        {tile}
        isInputRow
        flipping={uiState.flipping}
        revealAnimationDelay={i * 100}
    />
{/each}

<style lang="scss">
tile-row {
    display: flex;
    gap: 0.5rem;
}

tile-entry {
    display: grid;
    
    > :global(*) {
        grid-area: 1/1;
    }
}
</style>