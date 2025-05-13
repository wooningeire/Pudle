<script lang="ts">
import {backspaceGuess, consumeGuess, extendGuess, uiState } from "$lib/state/uiState.svelte.ts";
import TilePlaceholder from "./TilePlaceholder.svelte";
import { boardState } from "$lib/state/boardState.svelte";
import { N_ROWS } from "$lib/constants";
import {NoticeMessage, noticeState} from "$lib/state/noticeState.svelte";
    import { statsState } from "@/lib/state/statsState.svelte";


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

{#each uiState().guessTiles as tile, x}
    <TilePlaceholder
        {tile}
        isInputRow
        flipping={uiState().flipping}
        revealAnimationDelay={x * (statsState().isFirstGuess ? 300 : 100)}
        hidden={boardState.board[x].length >= N_ROWS}
        {x}
        y={N_ROWS - 1}
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