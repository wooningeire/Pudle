<script lang="ts">
    import Background from "@/lib/components/Background.svelte";
import GamePage from "@/lib/components/GamePage.svelte";
    import { settingsState, setupPersistentSettings } from "@/lib/state/settingsState.svelte";
    import { statsState } from "@/lib/state/statsState.svelte";
    import { onMount } from "svelte";


let mainEl = $state<HTMLElement | null>(null);

let mainElWidth = $state<number | null>(null);
let mainElHeight = $state<number | null>(null);

const bgWidth = $derived(mainElWidth ?? 0);
const bgHeight = $derived(mainElHeight ?? 0);

const resize = () => {
    mainElWidth = mainEl?.offsetWidth ?? innerWidth;
    mainElHeight = mainEl?.offsetHeight ?? innerHeight;
};

onMount(resize);

onMount(setupPersistentSettings);
</script>

<svelte:window onresize={resize} />

<main
    bind:this={mainEl}
    style:--tile-match={settingsState.matchTileColor}
    style:--tile-misplaced={settingsState.misplacedTileColor}
    style:--tile-absent={settingsState.absentTileColor}
>
    {#if !statsState().isFirstGuess}
        <Background
            width={bgWidth}
            height={bgHeight}
        />
    {/if}
    
    <GamePage />
</main>

<style lang="scss">
main {
    display: grid;
    place-items: center;
    
    min-width: 100vw;
    height: 100vh;

    perspective: 50rem;
    // overflow: hidden;

    > :global(*) {
        grid-area: 1/1;
    }
}
</style>