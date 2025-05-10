<script lang="ts">
import TileGuessRow from "./TileGuessRow.svelte";
import { N_ROWS } from "./constants";
import TileView from "./TileView.svelte";
import { gameState } from "./gameState.svelte";
</script>

<letter-board>
    <TileGuessRow />

    <tile-grid>
        {#each new Array(N_ROWS).fill(0) as _, x}
            {#each gameState.board as column}
                <TileView
                    tile={column[N_ROWS - x - 1] ?? null}
                />
            {/each}
        {/each}
    </tile-grid>
</letter-board>

<style lang="scss">
letter-board {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

tile-grid {
    display: grid;
    grid-template-columns: repeat(5, auto);
    gap: 0.5rem;
}
</style>
