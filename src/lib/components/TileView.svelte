<script lang="ts">
import {Tile, TileColor} from "$lib/types/Tile.ts";
import TileContent from "#/TileContent.svelte";
    import { fade, type TransitionConfig } from "svelte/transition";
    import { backOut, cubicOut } from "svelte/easing";
    import { BlueTileAction, blueTileAction, uiState } from "../state/uiState.svelte";

const {
    tile,
    x,
    y,
}: {
    tile: Tile,
    x: number,
    y: number,
} = $props();

const explode = (node: HTMLElement, params: TransitionConfig, options: {direction: "in" | "out" | "both"}) => {
    return {
        ...params,
        css: (t: number, u: number) => `transform: scale(${1.5 - t * 0.5}); opacity: ${t};`,
    };
};

const isBlue = $derived(tile.color === TileColor.Blue);

let isSelectingAction = $state(false);

$effect(() => {
    if (!uiState().inputLocked) return;
    if (tile.color !== TileColor.Blue) return;
    isSelectingAction = false;
});

const handleBlueClick = () => {
    if (uiState().inputLocked) return;
    if (!isBlue) return;
    isSelectingAction = true;
};

const performBlueSelect = (action: BlueTileAction) => {
    if (uiState().inputLocked) return;
    if (!isBlue || !isSelectingAction) return;

    blueTileAction(x, y, action);

    isSelectingAction = false;
};

const handleBlueBlur = () => {
    if (!isBlue) return;
    isSelectingAction = false;
};

const handleBlueKeydown = (event: KeyboardEvent) => {
    if (!["Enter", "Space"].includes(event.key)) return;
    handleBlueClick();
};
</script>


<tile-view
    out:explode|global={{duration: 500, easing: cubicOut, delay: Math.random() * 125}}
    onclick={() => handleBlueClick()}
    onkeydown={handleBlueKeydown}
    onblur={handleBlueBlur}
    tabindex={isBlue ? 0 : -1}
    class:blue={isBlue}
    class:selecting-color={isSelectingAction}
>
    <TileContent
        {tile}
        {x}
        {y}
    />

    {#if isSelectingAction}
        <blue-tile-action-selector transition:fade={{duration: 500, easing: backOut}}>
            <blue-tile-action-option
                class="green"
                onclick={() => performBlueSelect(BlueTileAction.SetGreen)}
            ></blue-tile-action-option>
            <blue-tile-action-option
                class="yellow"
                onclick={() => performBlueSelect(BlueTileAction.SetYellow)}
            ></blue-tile-action-option>
            <blue-tile-action-option
                class="destroy"
                onclick={() => performBlueSelect(BlueTileAction.DestroyNearby)}
            >
                destroy
            </blue-tile-action-option>
        </blue-tile-action-selector>
    {/if}
</tile-view>

<style lang="scss">
tile-view {
    width: var(--tile-size);
    height: var(--tile-size);
    font-size: 2rem;
    display: grid;
    place-items: stretch;

    transform-style: preserve-3d;

    > :global(*) {
        grid-area: 1/1;
    }
    

    transition:
        transform .25s cubic-bezier(0.2, 0.6, 0.265, 1.55),
        filter .125s ease-in-out;
    &.blue:not(.selecting-color) {
        cursor: pointer;
        filter: brightness(1.125);
    }


    &.selecting-color {
        transform: scale(1.125);
        > :global(tile-content) {
            opacity: 0.3333333;
        }
    }
}

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
    &.destroy {
        background: var(--tile-blue-dark);
        grid-area: 2/1 / 3/3;
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