<script lang="ts">
import { N_ROWS } from "$lib/constants";
import { boardState } from "@/lib/state/boardState.svelte";
import { TileColor } from "$lib/types/Tile";
    import { fly } from "svelte/transition";
    import { reset, uiState } from "$lib/state/uiState.svelte";
import Button from "./parts/Button.svelte";
    import { flipLeft, flipRight, halfFlipLeft, halfFlipRight } from "#/transition";
    import { backIn, backOut, cubicIn, cubicInOut, cubicOut, elasticIn, elasticOut } from "svelte/easing";
    import { statsState } from "$lib/state/statsState.svelte";
    import { roundState } from "@/lib/state/roundState.svelte";
    import { MatchResult } from "@/lib/types/MatchResult";


const emojiByLetter = new Map([
    ["A", "🇦"],
    ["B", "🇧"],
    ["C", "🇨"],
    ["D", "🇩"],
    ["E", "🇪"],
    ["F", "🇫"],
    ["G", "🇬"],
    ["H", "🇭"],
    ["I", "🇮"],
    ["J", "🇯"],
    ["K", "🇰"],
    ["L", "🇱"],
    ["M", "🇲"],
    ["N", "🇳"],
    ["O", "🇴"],
    ["P", "🇵"],
    ["Q", "🇶"],
    ["R", "🇷"],
    ["S", "🇸"],
    ["T", "🇹"],
    ["U", "🇺"],
    ["V", "🇻"],
    ["W", "🇼"],
    ["X", "🇽"],
    ["Y", "🇾"],
    ["Z", "🇿"],
]);

const resultsString = () => `**Pudle • https://wooningeire.github.io/pudle **
word ${statsState().nthWord} • guess ${statsState().nthGuess}
`;

const boardString = () =>
    new Array(N_ROWS).fill(0)
        .map((_, i) => {
            const y = N_ROWS - i - 1;
            return boardState.board
                .map(column => {
                    if (y >= column.length) {
                        return "◽";
                    }

                    return emojiByLetter.get(column[y].letter) ?? "🟦";
                })
                .join("\u200b");
        })
        .join("\n")
        
        + "\n";

const guessesString = () => roundState.pastWords
    .map(
        (entry, i) => {
            let out = `${i + 1}. `;

            out += entry.guesses
                .map(({matchResults}) => {
                    if (matchResults.every(result => result === MatchResult.Match)) {
                        return "✅";
                    }

                    const nMatches = matchResults.filter(result => result === MatchResult.Match).length;
                    if (nMatches >= 4) {
                        return "🟩";
                    }
                    if (nMatches >= 2) {
                        return "🟢";
                    }
                    // if (nMatches >= 2) {
                    //     return "💚";
                    // }

                    const nLetters = matchResults.filter(result => result === MatchResult.Misplaced || result === MatchResult.Match).length;
                    if (nLetters >= 4) {
                        return "🟨";
                    }
                    if (nLetters >= 2) {
                        return "🟡";
                    }
                    // if (nLetters >= 2) {
                    //     return "💛";
                    // }
                    // if (nLetters >= 1) {
                    //     return "◾";
                    // }
                    return "⬛";
                })
                .join("");

            out += ` ${entry.word}`;

            if (i === roundState.pastWords.length - 1) {
                out += " ❌";
            }

            return out;
        }
    )
    .join("\n")
        
    + "\n";

const writeToClipboard = async (text: string) => {
    try {
        await navigator.clipboard.writeText(text);
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
        onClick={() => writeToClipboard(resultsString() + guessesString())}
        disabled={!uiState().gameOver}
    >
        copy guess counts
    </Button>

    <Button
        onClick={() => writeToClipboard(resultsString() + boardString())}
        disabled={!uiState().gameOver}
    >
        copy board
    </Button>

    <Button
        onClick={() => writeToClipboard(resultsString() + guessesString() + boardString())}
        disabled={!uiState().gameOver}
    >
        copy both
    </Button>

    <Button
        onClick={replay}
        disabled={!uiState().gameOver}
    >replay</Button>
</game-over-options>

<style lang="scss">
game-over-options {
    font-size: 1.5rem;
    gap: 1rem;
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