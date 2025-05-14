<script lang="ts">
    import { cubicIn, cubicInOut, cubicOut, elasticOut, quartOut } from "svelte/easing";
    import PrevGuessesDisplay from "./widgets/prev-guesses-display/PrevGuessesDisplay.svelte";
    import { fade, fly } from "svelte/transition";
    import { flipRight, halfFlipLeft, halfFlipRight } from "#/transition";
    import Instructions from "./widgets/Instructions.svelte";
    import { flip } from "svelte/animate";
    import PauseButton from "./widgets/PauseButton.svelte";
    import { statsState } from "$lib/state/statsState.svelte";
    import { uiState } from "@/lib/state/uiState.svelte";
    import { roundState } from "@/lib/state/roundState.svelte";
    import { WORD_LENGTH } from "@/lib/constants";

const shownGuesses = $derived(
    uiState().gameOver
        ? roundState.pastWords.map((result, index) => ({result, index})).reverse()
        : [{result: roundState.pastWords.at(-1)!, index: roundState.pastWords.length - 1}]
);

const flyAbsoluteEarly = (
    node: HTMLElement,
	{
        delay=0,
        duration,
        easing,
        x=0,
        y=0,
    }: {delay?: number, duration: number, easing: (t: number) => number, x?: number, y?: number},
) => {
	const style = getComputedStyle(node);
	const transform = style.transform === 'none' ? '' : style.transform;

	return {
		delay,
		duration,
		easing,
		css: (t: number, u: number) => `
transform: ${transform} translate(${u * x}px, ${u * y}px);
opacity: ${t};`
	};
};
</script>

<right-panel in:halfFlipLeft={{duration: 5000, easing: elasticOut, baseRot: "-35deg"}}>
    <right-panel-top>
        <Instructions />

        <prev-guesses-grid-list>
            {#each shownGuesses as {result: {guesses}, index} (index)}
                {@const delay = (guesses.length + WORD_LENGTH - 1) * 100}
                <prev-guesses-item
                    in:flyAbsoluteEarly={{
                        duration: 500,
                        x: 50,
                        easing: cubicOut,
                        delay: uiState().gameOver
                            ? (roundState.pastWords.length - index) * 500
                            : 750 + delay,
                    }}
                    out:fly={{
                        duration: 500,
                        y: 50,
                        easing: cubicIn,
                        delay,
                    }}
                >
                    <prev-guesses-label out:fade|global={{duration: 250, easing: cubicIn, delay: 125}}>guesses for word {index + 1}</prev-guesses-label>
                    <prev-guesses-grid-container>
                        <PrevGuessesDisplay
                            guessResults={guesses}
                            showFinalWord={index === roundState.pastWords.length - 1}
                        />
                    </prev-guesses-grid-container>
                </prev-guesses-item>
            {/each}
        </prev-guesses-grid-list>
    </right-panel-top>

    <right-panel-bottom>
        <PauseButton />
    </right-panel-bottom>
</right-panel>




<style lang="scss">
@import "#/constants.scss";

* {
    transform-style: preserve-3d;
}

right-panel {
    grid-area: 2/3 / 4/4;
    place-self: stretch;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    transform: rotateY(-35deg) scale(var(--scale-fac));
    transform-origin: left;
    backface-visibility: hidden;


    --scale-fac: 1;
    @media screen and (max-width: $small-width) {
        --scale-fac: 0.75;
    }
    // @media screen and (max-width: $xsmall-width) {
    //     display: none;
    // }
}

right-panel-top {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    flex-grow: 1;
}

right-panel-bottom {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

prev-guesses-grid-list {
    // display: flex;
    // flex-direction: column;
    // gap: 1rem;

    height: 0;
    flex-grow: 1;
    flex-shrink: 1;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    overflow-y: auto;
    overflow-x: hidden;
    position: relative;
}

prev-guesses-item {
    display: flex;
    flex-direction: column;
}

prev-guesses-label {
    color: #42444baf;
}

prev-guesses-grid-container {
    padding-left: 1rem;
}
</style>