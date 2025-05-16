<script lang="ts">
import { revertToDefaultSettings, settingsState } from "@/lib/state/settingsState.svelte";
import { cubicInOut, cubicOut } from "svelte/easing";
import { fly } from "svelte/transition";
    import Button from "./widgets/parts/Button.svelte";

</script>

<settings-panel transition:fly={{duration: 250, y: 25, easing: cubicInOut}}>
    <input
        type="color"
        bind:value={settingsState.matchTileColor}
    />

    <setting-label>
        Match tile color
    </setting-label>


    <input type="color" bind:value={settingsState.misplacedTileColor} />

    <setting-label>
        Misplaced tile color
    </setting-label>


    <input type="color" bind:value={settingsState.absentTileColor} />

    <setting-label>
        Absent tile color
    </setting-label>


    <input type="checkbox" bind:checked={settingsState.bgFrozen} />

    <setting-option>
        Freeze background
    </setting-option>

    <Button
        onClick={() => revertToDefaultSettings()}
        moveDirection="up"
    >reset</Button>
</settings-panel>

<style lang="scss">
* {
    transform-style: preserve-3d;
}

settings-panel {
    grid-area: 2/2 / 4/3;

    position: relative;


    display: grid;
    grid-template-columns: auto auto;
    align-items: center;

    gap: 2rem 0.5rem;
    font-size: 1.5rem;
}

input {
    justify-self: center;
}

input[type="checkbox"] {
    width: 2rem;
    height: 2rem;
    accent-color: var(--tile-match);
}

:global(button-container) {
    grid-column: 1 / -1;
}
</style>