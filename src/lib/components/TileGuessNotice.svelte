<script lang="ts">
    import { cubicOut } from "svelte/easing";
    import { fly } from "svelte/transition";
    import { NoticeMessage, noticeState } from "../state/noticeState.svelte";
    import { flipBottom, flipTop } from "./transition";

</script>

{#if noticeState.currentMessage !== null}
    <tile-guess-notice-container>
        <tile-guess-notice
            in:flipTop|global={{duration: 750, easing: cubicOut}}
            out:flipBottom|global={{duration: 750, easing: cubicOut}}
        >
            {#if noticeState.currentMessage === NoticeMessage.SelectBlueTile}
                Select a tile from the word to convert into a blue tile!
            {:else if noticeState.currentMessage === NoticeMessage.AlreadyGuessedThisRound}
                Already guessed this word this round!
            {:else if noticeState.currentMessage === NoticeMessage.NotInWordList}
                Not in word list!
            {/if}
        </tile-guess-notice>
    </tile-guess-notice-container>
{/if}

<style lang="scss">
* {
    transform-style: preserve-3d;
}

tile-guess-notice-container {
    display: grid;
    place-items: stretch;
    position: absolute;
    top: 5rem;
    left: 50%;
    width: 25rem;

    transform: translateX(-50%) translateZ(3rem);

    transition: opacity 0.125s ease-in-out;

    &:hover {
        opacity: 0.5;
    }
}

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