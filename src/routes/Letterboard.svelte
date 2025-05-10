<script lang="ts">
import TileRow from "./TileRow.svelte";
import TileGuessRow from "./TileGuessRow.svelte";
import { gameState } from "./gameState.svelte";
</script>

<letter-board>
    <TileGuessRow />

    {#each gameState.board as row}
        <TileRow tiles={row} />
    {/each}
</letter-board>

<style lang="scss">
letter-board {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}
</style>
