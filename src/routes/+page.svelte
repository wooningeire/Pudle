<script lang="ts">
import { initialLoadPromise } from "./gameState.svelte";
import "./index.scss";
import Keyboard from "./Keyboard.svelte";
import Letterboard from "./Letterboard.svelte";
</script>

<main>
    {#await initialLoadPromise}
        Loading
    {:then}
        <Letterboard />

        <Keyboard />
    {:catch}
        Error, please reload
    {/await}
</main>

<style lang="scss">
main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    gap: 2rem;
    
    width: 100vw;
    height: 100vh;
    user-select: none;
}
</style>