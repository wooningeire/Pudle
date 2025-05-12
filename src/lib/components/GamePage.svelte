<script>
import PudleTitle from "./PudleTitle.svelte";
import RightPanel from "@/lib/components/panels/RightPanel.svelte";
import LeftPanel from "@/lib/components/panels/LeftPanel.svelte";
import Keyboard from "@/lib/components/board/Keyboard.svelte";
import Letterboard from "@/lib/components/board/Letterboard.svelte";
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
* {
    transform-style: preserve-3d;
}

game-page {
    display: grid;
    align-items: center;
    justify-items: center;

    grid-template-columns: 15rem auto 15rem;
    grid-template-rows: auto auto auto 5rem;
    margin: 0 5rem;

    gap: 2rem;
}
</style>