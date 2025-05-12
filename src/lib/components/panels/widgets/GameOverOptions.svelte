<script>
import { N_ROWS } from "$lib/constants";
import { boardState } from "@/lib/state/boardState.svelte";
import { TileColor } from "$lib/types/Tile";
    import { fly } from "svelte/transition";
    import { reset, uiState } from "$lib/state/uiState.svelte";
import Button from "./parts/Button.svelte";
    import { flipLeft, flipRight, halfFlipLeft, halfFlipRight } from "#/transition";
    import { backIn, backOut, cubicIn, cubicInOut, cubicOut, elasticIn, elasticOut } from "svelte/easing";
    import { statsState } from "$lib/state/statsState.svelte";

const resultsString = () => `**Pudle • https://wooningeire.github.io/pudle**
word ${statsState.nthWord} • guess ${statsState.nthGuess}
${
    new Array(N_ROWS).fill(0)
        .map((_, i) => {
            const y = N_ROWS - i - 1;
            return boardState.board
                .map(column => {
                    if (y >= column.length) {
                        return "◽";
                    }

                    switch (column[y].color) {
                        case TileColor.Empty:
                            return "◻️";
                        case TileColor.Gray:
                            return "⬛";
                        case TileColor.Yellow:
                            return "🟨";
                        case TileColor.Green:
                            return "🟩";
                        case TileColor.Blue:
                            return "🟦";
                    }
                })
                .join("");
        })
        .join("\n")
}`;

const copyResults = async () => {
    try {
        await navigator.clipboard.writeText(resultsString());
        return true;
    } catch (error) {
        console.log(error);
    }
    return false;
};
const replay = () => {
    reset();
    return true;
};
</script>

<game-over-options
    in:halfFlipRight|global={{duration: 4000, easing: elasticOut}}
    out:halfFlipLeft|global={{duration: 500, easing: backIn}}
>
    <game-over-label>game over</game-over-label>

    <Button
        onClick={copyResults}
        disabled={!uiState().gameOver}
    >
        copy results
    </Button>

    <Button
        onClick={replay}
        disabled={!uiState().gameOver}
    >replay</Button>
</game-over-options>

<style lang="scss">
game-over-options {
    font-size: 1.5rem;
    gap: 2rem;
    text-align: center;

    display: flex;
    flex-direction: column;
    align-items: stretch;
    backface-visibility: hidden;
    transform-style: preserve-3d;
}
game-over-label {
    font-size: 2rem;
}
</style>