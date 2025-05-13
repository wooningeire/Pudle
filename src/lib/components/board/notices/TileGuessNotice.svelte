<script lang="ts">
    import { NoticeMessage } from "$lib/state/noticeState.svelte";

const {
    message,
}: {
    message: NoticeMessage,
} = $props();
</script>

<tile-guess-notice>
    {#if message === NoticeMessage.Loading}
        Loading!
    {:else if message === NoticeMessage.LoadingFailed}
        Loading failed &gt;.=.&lt;" … please reload!
    {:else if message === NoticeMessage.SelectBlueTile}
        Pick a tile from the word to turn it blue!
    {:else if message === NoticeMessage.AlreadyGuessedThisRound}
        Already guessed this round!
    {:else if message === NoticeMessage.NotInWordList}
        Not in word list!
    {/if}
</tile-guess-notice>

<style lang="scss">
tile-guess-notice {
    text-align: center;
    font-size: 1.25rem;
    padding: 0.75rem 1rem;

    background: #000000cf;
    color: #fff;
    border-radius: 1rem;

    outline: 2px solid #000000cf;
    outline-offset: 0.125rem;
    outline-style: dotted;

    box-shadow: 0 0.5rem 2rem #0000003f;

    backface-visibility: hidden;
}
</style>