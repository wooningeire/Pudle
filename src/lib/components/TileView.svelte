<script lang="ts" module>
let whichBlueTileIsOpen = $state<Tile | null>(null);
</script>

<script lang="ts">
import {Tile, TileColor} from "$lib/types/Tile.ts";
import TileContent from "#/TileContent.svelte";
    import { fade, type TransitionConfig } from "svelte/transition";
    import { backOut, cubicOut } from "svelte/easing";
    import { BlueTileAction, blueTileAction, previewBlueTileRange, uiState } from "../state/uiState.svelte";
    import BlueTileActionSelector from "./BlueTileActionSelector.svelte";
    import { stopPropagation } from "svelte/legacy";
    import { keyboardClick } from "./event";
    import { noticeEvent, NoticeMessage, noticeState } from "../state/noticeState.svelte";
    import { N_ROWS } from "../constants";
    import { onDestroy, onMount } from "svelte";

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
const isSelectingAction = $derived(whichBlueTileIsOpen === tile);

$effect(() => {
    if (!uiState().inputLocked) return;
    if (tile.color !== TileColor.Blue) return;
    whichBlueTileIsOpen = null;
});

const handleBlueClick = (event: MouseEvent | null=null) => {
    if (uiState().inputLocked) return;
    if (!isBlue) return;

    event?.stopPropagation();
    whichBlueTileIsOpen = tile;
};

const performBlueSelect = (action: BlueTileAction) => {
    if (uiState().inputLocked) return;
    if (!isBlue || !isSelectingAction) return;

    blueTileAction(x, y, action);

    whichBlueTileIsOpen = null;
};

const performBluePreview = (action: BlueTileAction) => {
    if (uiState().inputLocked) return;
    if (!isBlue || !isSelectingAction) return;

    previewBlueTileRange(x, y, action);
};

const handleBlueBlur = () => {
    if (!isBlue) return;
    whichBlueTileIsOpen = null;
};


let containerEl = $state<HTMLDivElement | null>(null);

const generateShake = (maxScale: number) => {
    let x: number;
    let y: number;
    while (true) {
        x = Math.random() * 2 - 1;
        y = Math.random() * 2 - 1;

        if (x**2 + y**2 < 1) break;
    }

    return { transform: `translate(${x * maxScale}rem, ${y * maxScale}rem)` };
};

const handleMessage: EventListener = (event: Event) => {
    const {detail: message} = <CustomEvent<NoticeMessage>>event;

    if (
        message !== NoticeMessage.ColumnBlocked
        || y !== N_ROWS - 1
        || x !== uiState().firstBlockedColumnIndex
    ) return;

    containerEl!.animate(
        [
            {transform: "translate(0, 0)"},
            ...new Array(15).fill(0).map((_, i) => generateShake(1.5 ** (-i - 1))),
            {transform: "translate(0, 0)"},
        ],
        {
            duration: 500,
            iterations: 1,
            easing: "ease-in-out",
            
        },
    );
};

onMount(() => {
    noticeEvent.addEventListener("message", handleMessage);
});

onDestroy(() => {
    noticeEvent.removeEventListener("message", handleMessage);
});
</script>

<svelte:window onclick={() => handleBlueBlur()} />

<tile-view
    out:explode|global={{duration: 500, easing: cubicOut, delay: Math.random() * 125}}
    onclick={handleBlueClick}
    onkeydown={keyboardClick(handleBlueClick)}
    tabindex={isBlue ? 0 : -1}
    class:blue={isBlue}
    class:selecting-color={isSelectingAction}
    class:can-be-clicked={!uiState().inputLocked}
    bind:this={containerEl}
>
    <TileContent
        {tile}
        {x}
        {y}
    />

    {#if isSelectingAction}
        <BlueTileActionSelector
            onSelect={performBlueSelect}
            onPreview={performBluePreview}
        />
    {/if}
</tile-view>

<style lang="scss">
tile-view {
    pointer-events: all;
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

    &.blue {
        
        &:not(.selecting-color).can-be-clicked {
            cursor: pointer;
            &:hover {
                filter: brightness(1.125);
                transform: scale(1.25);
            }
        }
    }


    &.selecting-color {
        transform: scale(1.25);
        > :global(tile-content) {
            opacity: 0.3333333;
        }
    }
}
</style>