<script lang="ts">
import { getMatchResultCssColor, getMatchResultCssColorDark } from "$lib/types/tileColors.ts";
import { uiState } from "$lib/state/uiState.svelte.ts";
import { PositionType, roundState } from "../state/roundState.svelte";
    import { MatchResult } from "../types/MatchResult";
    import { TileColor } from "../types/Tile";

const {
    onClick,
    label,
    small = false,
    colorable = false,
    forceDisabled = false,
}: {
    onClick: () => void,
    label: string,
    small?: boolean,
    colorable?: boolean,
    forceDisabled?: boolean,
} = $props();

const inputingWhichLetter = $derived(uiState.guess.length);

const hasInfo = $derived(colorable && Object.hasOwn(roundState.knownLetterInfo, label));
const info = $derived(hasInfo ? roundState.knownLetterInfo[label] : null);
const currentLetterPositionInfo = $derived(info?.positionInfo[inputingWhichLetter] ?? null);

const bgColor = $derived(hasInfo ? getMatchResultCssColor(info!.type) : "");
const bgColorDark = $derived(hasInfo ? getMatchResultCssColorDark(info!.type) : "");

const must = $derived(
    !uiState.inputLocked
        && colorable
        && currentLetterPositionInfo === PositionType.MustBeInPosition
);
const mustNot = $derived(
    colorable && currentLetterPositionInfo === PositionType.MustNotBeInPosition
);
const disabled = $derived(uiState.inputLocked || forceDisabled);
</script>

<button
    onclick={() => !disabled && onClick()}
    class:small
    class:has-color={hasInfo && info!.type !== MatchResult.Empty}
    class:must
    class:must-not={mustNot}
    style:background={bgColor}
    style:--box-shadow-color={bgColorDark}
    {disabled}
>
    {label}
</button>

<style lang="scss">
button {
    --box-shadow-color: var(--button-bg-dark);

    display: grid;
    place-items: center;
    background: var(--button-bg);
    box-shadow: 0 0.25rem var(--box-shadow-color);
    border: none;
    width: 2rem;
    height: 3rem;
    border-radius: 0.5rem;

    transition:
        background 0.175s ease-in-out,
        box-shadow 0.175s ease-in-out,
        color 0.175s ease-in-out,
        opacity 0.5s cubic-bezier(.14,.67,.2,1.43),
        transform 0.5s cubic-bezier(.14,.67,.2,1.43),
        filter 0.125s ease-in-out;

    &:hover,
    &:focus {
        transform: translateY(-0.125rem);
        filter: brightness(1.125);
    }

    &:active {
        transform: translateY(-0.125rem);
        filter: brightness(0.85);
    }

    &.small {
        font-size: 1rem;
    }

    &.must {
        transform: scale(1.15);
        animation: pulse 0.5s infinite ease-in-out;

        @keyframes pulse {
            0% {
                filter: brightness(1);
            }
            50% {
                filter: brightness(1.25);
            }
            100% {
                filter: brightness(1);
            }
        }
    }

    &.must-not {
        filter: brightness(0.75);
    }

    &.has-color {
        color: #fff;
    }

    &[disabled] {
        opacity: 0.3333333;
        transform: scale(0.85);
        pointer-events: none;
    }

    cursor: pointer;
}
</style>