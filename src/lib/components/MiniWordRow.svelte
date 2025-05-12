<script lang="ts">
    import { onDestroy, onMount, tick } from "svelte";
import { MatchResult } from "../types/MatchResult";
    import { TileColor } from "../types/Tile";
import MiniTile from "./MiniTile.svelte";
    import { uiState } from "../state/uiState.svelte";
    import { noticeEvent, NoticeMessage, noticeState } from "../state/noticeState.svelte";

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
    animation: already-guessed-flash 0.75s cubic-bezier(.01,-0.42,1,-1.23);

    transform-origin: center;
    position: relative;

    @keyframes already-guessed-flash {
        30% {
            transform: scale(1.125);
            filter: sepia(1) hue-rotate(-55deg) saturate(2);
        }
    }
}
</style>