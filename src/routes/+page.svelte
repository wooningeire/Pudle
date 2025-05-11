<script lang="ts">
    import CurrentWordInfo from "#/CurrentWordInfo.svelte";
    import GameStatus from "#/GameStatus.svelte";
import Keyboard from "#/Keyboard.svelte";
import Letterboard from "#/Letterboard.svelte";
    import { onMount } from "svelte";
    import { setupInitialLoad } from "$lib/state/initialLoadState.svelte";


let initialLoadPromise = $state<Promise<void>>(new Promise(resolve => {
    onMount(async () => {
        await setupInitialLoad();
        resolve();
    });
}));

</script>

<main>
    {#await initialLoadPromise}
        Loading
    {:then}
        <center-content>
            <Keyboard />

            <Letterboard />

            <GameStatus />

            <CurrentWordInfo />
        </center-content>
    {:catch}
        Error, please reload
    {/await}
</main>

<style lang="scss">
main {
    display: grid;
    place-items: center;
    
    width: 100vw;
    height: 100vh;
}

center-content {
    display: grid;
    align-items: center;
    justify-items: center;

    grid-template-columns: 1fr auto 1fr;
    grid-template-rows: auto auto;

    gap: 2rem;
}
</style>