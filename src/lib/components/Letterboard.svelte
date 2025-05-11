<script lang="ts">
import TileGuessRow from "#/TileGuessRow.svelte";
import { N_ROWS, WORD_LENGTH } from "$lib/constants.ts";
import TileView from "#/TileView.svelte";
import { gameState } from "$lib/state/gameState.svelte.ts";
    import TileBg from "#/TileBg.svelte";
    import { flip } from "svelte/animate";
    import { bounceOut, cubicInOut } from "svelte/easing";
</script>

<letter-board
    style:--n-rows={N_ROWS}
    style:--word-length={WORD_LENGTH}
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
                        animate:flip={{duration: 750, easing: bounceOut}}
                        style:grid-area="{N_ROWS - y}/{x + 1}"
                    >
                        {#if y < N_ROWS}
                            <TileView {tile} {x} />
                        {/if}
                    </tile-view-container>
                {/each}
            {/each}
        </tile-grid>
    </tile-grids>
</letter-board>

<style lang="scss">
* {
    transform-style: preserve-3d;
}

letter-board {
    grid-area: 3/2 / 5/3;
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
    grid-template-columns: repeat(var(--word-length), 1fr);
    grid-template-rows: repeat(var(--n-rows), 1fr);
    gap: 0.5rem;
}

tile-view-container {
    display: grid;
    place-items: stretch;
}

</style>
