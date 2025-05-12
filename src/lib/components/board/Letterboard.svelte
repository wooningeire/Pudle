<script lang="ts">
import TileGuessRow from "./tile/TileGuessRow.svelte";
import { N_ROWS, WORD_LENGTH } from "$lib/constants.ts";
import TileView from "./tile/TileView.svelte";
import { boardState } from "@/lib/state/boardState.svelte";
    import TilePlaceholder from "./tile/TilePlaceholder.svelte";
    import { flip } from "svelte/animate";
    import { bounceOut, cubicInOut } from "svelte/easing";
    import TileGuessNotice from "./notices/TileGuessNotice.svelte";
    import { noticeState } from "$lib/state/noticeState.svelte";
    import NoticeList from "./notices/NoticeList.svelte";
    import { TileColor } from "@/lib/types/Tile";
</script>

<letter-board
    style:--n-rows={N_ROWS}
    style:--word-length={WORD_LENGTH}
>
    <tile-grids>
        <tile-grid>
            {#each boardState.board as column, x}
                {#each new Array(N_ROWS - 1).fill(0) as _, y}
                    <TilePlaceholder
                        hidden={column.length > y}
                        {x}
                        {y}
                    />
                {/each}
            {/each}

            <TileGuessRow />
        </tile-grid>

        <tile-grid>
            {#each boardState.board as column, x}
                {#each column as tile, y (tile.id)}
                    <tile-view-container
                        animate:flip={{duration: 750, easing: bounceOut}}
                        style:grid-area="{N_ROWS - y}/{x + 1}"
                        style:z-index={tile.color === TileColor.Blue ? "1" : ""}
                    >
                        {#if y < N_ROWS}
                            <TileView {tile} {x} {y} />
                        {/if}
                    </tile-view-container>
                {/each}
            {/each}
        </tile-grid>
    </tile-grids>

    <NoticeList />
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
    position: relative;
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
    pointer-events: none;
}

tile-view-container {
    display: grid;
    place-items: stretch;
}

</style>
