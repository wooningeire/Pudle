<script lang="ts">
import {backspaceGuess, consumeGuess, extendGuess, uiState} from "./uiState.svelte.ts";
    import TileBg from "./TileBg.svelte";
    import { gameState } from "./gameState.svelte.ts";
    import { N_ROWS } from "./constants.ts";
    import TileContent from "./TileContent.svelte";


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

enum TileSource {
    Guessing,
    LastGuess,
}

const tiles = $derived(
    new Array(5).fill(0).map((_, i) => gameState.board[i].length > N_ROWS
        ? {tile: gameState.board[i][N_ROWS], source: TileSource.LastGuess}
        : {tile: uiState.guessTiles[i], source: TileSource.Guessing}
    )
);
</script>


<svelte:window onkeydown={keydown} />

<tile-row>
    {#each tiles as {tile, source}, i}
        <tile-entry>
            <TileBg
                tile={source === TileSource.Guessing ? tile : null}
                isInputRow
                flipping={uiState.isFlipping}
                revealAnimationDelay={i * 100}
            />
    
            {#if source === TileSource.LastGuess}
                <TileContent
                    {tile}
                />
            {/if}
        </tile-entry>
    {/each}
</tile-row>

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