<script lang="ts">
import TileGuessRow from "#/TileGuessRow.svelte";
import { N_ROWS } from "$lib/constants.ts";
import TileView from "#/TileView.svelte";
import { gameState } from "$lib/state/gameState.svelte.ts";
    import TileBg from "#/TileBg.svelte";
    import { flip } from "svelte/animate";
    import { cubicInOut } from "svelte/easing";
</script>

<letter-board
    style:--n-rows={N_ROWS}
>
    <tile-grids>
        <tile-grid>
            <TileGuessRow />

            {#each gameState.board as column, x}
                {#each new Array(N_ROWS - 1).fill(0) as _, y}
                    <TileBg
                        hidden={column.length > y}
                        {x}
                        {y}
                    />
                {/each}
            {/each}
        </tile-grid>

        <tile-grid>
            {#each gameState.board as column, x}
                {#each column as tile, y (tile.id)}
                    <tile-view-container
                        animate:flip={{duration: 500, easing: cubicInOut}}
                        style:grid-area="{N_ROWS - y}/{x + 1}"
                    >
                        {#if y < N_ROWS}
                            <TileView {tile} />
                        {/if}
                    </tile-view-container>
                {/each}
            {/each}
        </tile-grid>
    </tile-grids>
</letter-board>

<style lang="scss">
letter-board {
    grid-area: 2/2;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    user-select: none;
}

tile-grids {
    display: grid;
    align-items: stretch;

    > * {
        grid-area: 1/1;
    }
}

tile-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: repeat(var(--n-rows), 1fr);
    gap: 0.5rem;
}

tile-view-container {
    display: grid;
    place-items: stretch;
}
</style>
