<script lang="ts">
import TileRow from "./TileRow.svelte";
import {Tile, TileType} from "./Tile.ts";
import {backspaceGuess, consumeGuess, extendGuess, inputState} from "./inputState.svelte.ts";
import {nextTileId} from "./uiState.svelte.ts";

const tileIds = $state(new Array(5).fill(0).map(() => nextTileId()));

const tiles = $derived(
    inputState.guess
        .padEnd(5, " ")
        .split("")
        .map((char, i) => new Tile(tileIds[i], TileType.Empty, char === " " ? "" : char))
);

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

<TileRow {tiles} />
