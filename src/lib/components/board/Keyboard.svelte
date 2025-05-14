<script lang="ts">
import { backspaceGuess, consumeGuess, extendGuess, uiState } from "$lib/state/uiState.svelte.ts";
import Key from "@/lib/components/board/key/Key.svelte";
import {WORD_LENGTH} from "$lib/constants.ts";

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
                    forceDisabled={uiState().guess.length === 0}
                />
            {/if}

            {#each row as char}
                <Key
                    label={char}
                    onClick={() => extendGuess(char)}
                    colorable
                    forceDisabled={uiState().guess.length === WORD_LENGTH}
                />
            {/each}

            {#if i === 2}
                <Key
                    label="GO"
                    onClick={consumeGuess}
                    small
                    forceDisabled={uiState().guess.length !== WORD_LENGTH}
                />
            {/if}
        </key-row>
    {/each}
</key-board>


<style lang="scss">
key-board {
    grid-area: 2/2;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
    font-size: 1.5rem;
    user-select: none;
    margin-bottom: 2rem;
}

key-row {
    display: flex;
    gap: 0.5rem;
}
</style>