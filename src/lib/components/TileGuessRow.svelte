<script lang="ts">
import {backspaceGuess, consumeGuess, extendGuess, uiState } from "$lib/state/uiState.svelte.ts";
import TilePlaceholder from "@/lib/components/TilePlaceholder.svelte";
import { gameState, isFirstGuess } from "../state/gameState.svelte";
import { N_ROWS } from "../constants";
import {NoticeMessage, noticeState} from "$lib/state/noticeState.svelte";


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
        revealAnimationDelay={x * (isFirstGuess() ? 300 : 100)}
        hidden={gameState.board[x].length >= N_ROWS}
        {x}
        y={N_ROWS - 1}
        doGuessRejectShake={
            noticeState.newestMessage !== null
                && [NoticeMessage.AlreadyGuessedThisRound, NoticeMessage.NotInWordList].includes(noticeState.newestMessage.message)
        }
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