<script lang="ts">
import GamePage from "@/lib/components/GamePage.svelte";

</script>

<main>
    <GamePage />
</main>

<style lang="scss">
main {
    display: grid;
    place-items: center;
    
    width: 100vw;
    height: 100vh;

    perspective: 50rem;
    // overflow: hidden;
}
</style>