<script lang="ts">
    import { tick } from "svelte";
import { MatchResult } from "../types/MatchResult";
    import { TileColor } from "../types/Tile";
import MiniTile from "./MiniTile.svelte";
    import { uiState } from "../state/uiState.svelte";
    import { NoticeMessage, noticeState } from "../state/noticeState.svelte";

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
$inspect(isDoingAlreadyGuessedFlash);

$effect(() => {
    if (
        noticeState.emittedMessage === null
        || noticeState.emittedMessage.message !== NoticeMessage.AlreadyGuessedThisRound
        || word !== uiState().guess
    ) return;

    (async () => {
        isDoingAlreadyGuessedFlash = false;
        await tick();
        isDoingAlreadyGuessedFlash = true;
    })();
});
</script>

<mini-word-row
    class:already-guessed-flash={isDoingAlreadyGuessedFlash}
    onanimationend={() => isDoingAlreadyGuessedFlash = false}
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
    animation: already-guessed-flash 0.5s ease-in-out;

    transform-origin: center;
    position: relative;

    @keyframes already-guessed-flash {
        15% {
            transform: scale(1.125);
            filter: sepia(1) hue-rotate(-55deg) saturate(2);
        }
    }
}
</style>