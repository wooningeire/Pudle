<script>
import PudleTitle from "./PudleTitle.svelte";
import RightPanel from "#/RightPanel.svelte";
import LeftPanel from "#/LeftPanel.svelte";
import Keyboard from "#/Keyboard.svelte";
import Letterboard from "#/Letterboard.svelte";
    import { fade } from "svelte/transition";

</script>

<game-page in:fade={{duration: 500}}>
    <PudleTitle fades />

    <Keyboard />

    <Letterboard />

    <LeftPanel />

    <RightPanel />
</game-page>

<style lang="scss">
game-page {
    display: grid;
    align-items: center;
    justify-items: center;

    grid-template-columns: 15rem auto 15rem;
    grid-template-rows: auto auto 20rem;

    gap: 2rem;
    perspective: 50rem;
}
</style>