<script lang="ts">
    import { fade } from "svelte/transition";
    import { BlueTileAction, stopPreviewBlueTileRange } from "$lib/state/uiState.svelte";
    import { backOut } from "svelte/easing";
    import { keyboardClick } from "../../event";

const {
    onSelect,
    onPreview,
}: {
    onSelect: (action: BlueTileAction) => void,
    onPreview: (action: BlueTileAction) => void,
} = $props();

const stopPreview = () => {
    stopPreviewBlueTileRange();
};
</script>


<blue-tile-action-selector transition:fade={{duration: 500, easing: backOut}}>
    <blue-tile-action-option
        class="green"
        onclick={() => onSelect(BlueTileAction.DestroyGreen)}
        onkeydown={keyboardClick(() => onSelect(BlueTileAction.DestroyGreen))}
        tabindex="0"
        onpointerover={() => onPreview(BlueTileAction.DestroyGreen)}
        onpointerout={() => stopPreview()}
    ></blue-tile-action-option>
    <blue-tile-action-option
        class="yellow"
        onclick={() => onSelect(BlueTileAction.DestroyYellow)}
        onkeydown={keyboardClick(() => onSelect(BlueTileAction.DestroyYellow))}
        tabindex="0"
        onpointerover={() => onPreview(BlueTileAction.DestroyYellow)}
        onpointerout={() => stopPreview()}
        ></blue-tile-action-option>
    <blue-tile-action-option
        class="cross"
        onclick={() => onSelect(BlueTileAction.Cross)}
        onkeydown={keyboardClick(() => onSelect(BlueTileAction.Cross))}
        tabindex="0"
        onpointerover={() => onPreview(BlueTileAction.Cross)}
        onpointerout={() => stopPreview()}
    >
        cross
    </blue-tile-action-option>
</blue-tile-action-selector>


<style lang="scss">
blue-tile-action-selector {
    display: grid;
    place-items: stretch;
    grid-template-rows: 1fr 1fr;
    grid-template-columns: 1fr 1fr;
    position: relative;
    gap: 0.25rem;
}

blue-tile-action-option {
    box-shadow:
        0 0.125rem 0.5rem var(--tile-green-dark),
        0 0 0 2px #fff inset;
    cursor: pointer;
    color: #fff;
    font-size: 0.8rem;

    display: grid;
    place-items: center;

    &.green {
        background: var(--light-green);
        grid-area: 1/1;
    }
    &.yellow {
        background: var(--light-yellow);
        grid-area: 1/2;
    }
    &.cross {
        background: var(--tile-blue-dark);
        grid-area: 2/1 / 3/-1;
    }

    transition:
        filter 0.125s ease-in-out,
        transform 0.125s cubic-bezier(0.1, 0.6, 0.265, 1.55);

    &:hover,
    &:focus {
        filter: brightness(1.25);
        transform: scale(1.125);
    }

    &:active {
        filter: brightness(0.85);
    }
}
</style>