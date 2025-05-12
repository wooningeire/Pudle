<script lang="ts">
    import TileGuessNotice from "./TileGuessNotice.svelte";
import {noticeState} from "$lib/state/noticeState.svelte";
    import { flip } from "svelte/animate";
    import { cubicIn, cubicInOut, cubicOut } from "svelte/easing";
    import { flipBottom, flipBottomAndFade, flipTop } from "./transition";
    import { fade, fly } from "svelte/transition";
</script>

<notice-list>
    {#each [...noticeState.messages].slice(-5) as [id, message] (id)}
        <tile-guess-notice-container
            animate:flip={{duration: 250, easing: cubicOut}}
            in:flipTop={{duration: 750, easing: cubicOut}}
            out:fly={{duration: 250, easing: cubicIn, y: 25}}
        >
            <TileGuessNotice {message} />
        </tile-guess-notice-container>
    {/each}
</notice-list>

<style lang="scss">

* {
    transform-style: preserve-3d;
}

notice-list {
    position: absolute;
    top: 5rem;
    left: 50%;
    width: 25rem;
    gap: 1rem;
    display: flex;
    flex-direction: column-reverse;

    transform: translateX(-50%) translateZ(3rem);

    pointer-events: none;

    // transition: opacity 0.125s ease-in-out;
    // &:hover {
    //     opacity: 0.25;
    // }
}

tile-guess-notice-container {
    display: grid;
    place-items: stretch;

    backface-visibility: hidden;
}
</style>