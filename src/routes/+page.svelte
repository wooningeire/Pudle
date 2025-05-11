<script lang="ts">
    import { onMount } from "svelte";
    import { setupInitialLoad } from "$lib/state/initialLoadState.svelte";
    import GamePage from "@/lib/components/GamePage.svelte";
    import LoadingScreen from "@/lib/components/LoadingScreen.svelte";


let initialLoadPromise = $state<Promise<void>>(new Promise(resolve => {
    onMount(async () => {
        await setupInitialLoad();
        resolve();
    });
}));

</script>

<main>
    {#await initialLoadPromise}
        <LoadingScreen />
    {:then}
        <GamePage />
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

    overflow: hidden;
}
</style>