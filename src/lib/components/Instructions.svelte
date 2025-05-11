<script>
    import { ISLAND_SIZE_THRESHOLD } from "../constants";
    import { MatchResult } from "../types/MatchResult";
    import MiniTile from "./MiniTile.svelte";

</script>
<instructions-text>
    <p>
        Create groups of {ISLAND_SIZE_THRESHOLD} <MiniTile matchResult={MatchResult.Match} smaller />
        or {ISLAND_SIZE_THRESHOLD} <MiniTile matchResult={MatchResult.Misplaced} smaller />!
    </p>

    <!-- <p>
        Groups will destroy nearby <MiniTile matchResult={MatchResult.Absent} smaller />!
    </p>

    <p>
        If the timer runs out, more <MiniTile matchResult={MatchResult.Absent} smaller /> will drop!
    </p> -->
</instructions-text>

<style lang="scss">
instructions-text {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

p {
    margin: 0;
}
</style>