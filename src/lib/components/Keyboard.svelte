<script lang="ts">
import { backspaceGuess, consumeGuess, extendGuess } from "$lib/state/uiState.svelte.ts";
import Key from "#/Key.svelte";

const keyRows = [
    "QWERTYUIOP",
    "ASDFGHJKL",
    "ZXCVBNM",
];
</script>

<key-board>
    {#each keyRows as row, i}
        <key-row>
            {#if i === 2}
                <Key
                    label="DEL"
                    onClick={backspaceGuess}
                    small
                />
            {/if}

            {#each row as char}
                <Key
                    label={char}
                    onClick={() => extendGuess(char)}
                    colorable
                />
            {/each}

            {#if i === 2}
                <Key
                    label="GO"
                    onClick={consumeGuess}
                    small
                />
            {/if}
        </key-row>
    {/each}
</key-board>


<style lang="scss">
key-board {
    grid-area: 1/2;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
    font-size: 1.5rem;
    user-select: none;
}

key-row {
    display: flex;
    gap: 0.5rem;
}
</style>