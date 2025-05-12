<script lang="ts">
    import { onDestroy, onMount, tick } from "svelte";
import { MatchResult } from "$lib/types/MatchResult";
    import { TileColor } from "$lib/types/Tile";
import MiniTile from "../parts/MiniTile.svelte";
    import { uiState } from "$lib/state/uiState.svelte";
    import { noticeEvent, NoticeMessage, noticeState } from "$lib/state/noticeState.svelte";

const {
    word,
    matchResults,
    y,
}: {
    word: string,
    matchResults: MatchResult[],
    y: number,
} = $props();

const resultsToColors = new Map([
    [MatchResult.Empty, TileColor.Empty],
    [MatchResult.Absent, TileColor.Gray],
    [MatchResult.Misplaced, TileColor.Yellow],
    [MatchResult.Match, TileColor.Green],
]);


let isDoingAlreadyGuessedFlash = $state(false);

const handleMessage: EventListener = (event: Event) => {
    const {detail: message} = <CustomEvent<NoticeMessage>>event;

    if (
        message !== NoticeMessage.AlreadyGuessedThisRound
        || word !== uiState().guess
    ) return;

    (async () => {
        isDoingAlreadyGuessedFlash = false;
        await tick();
        isDoingAlreadyGuessedFlash = true;
    })();
};

onMount(() => {
    noticeEvent.addEventListener("message", handleMessage);
});

onDestroy(() => {
    noticeEvent.removeEventListener("message", handleMessage);
});

let containerEl = $state<HTMLDivElement | null>();
</script>

<mini-word-row
    class:already-guessed-flash={isDoingAlreadyGuessedFlash}
    bind:this={containerEl}
    onanimationend={(event: Event) => event.currentTarget === containerEl && (isDoingAlreadyGuessedFlash = false)}
>
    {#each word as letter, x}
        <MiniTile
            {letter}
            tileColor={resultsToColors.get(matchResults[x])!}
            {x}
            {y}
        />
    {/each}
</mini-word-row>

<style lang="scss">
mini-word-row {
    display: flex;
    gap: 0.125rem;
}

.already-guessed-flash {
    animation: already-guessed-flash 1s cubic-bezier(.28,.01,0,1);

    transform-origin: center;
    position: relative;

    @keyframes already-guessed-flash {
        30%,
        40% {
            transform: scale(1.15);
            filter: sepia(1) hue-rotate(-55deg) saturate(2);
        }
    }
}
</style>