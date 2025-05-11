<script lang="ts">
import { getTileTypeCssColor, getTileTypeCssColorDark } from "$lib/types/tileColors.ts";
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

const bgColor = $derived(hasInfo ? getTileTypeCssColor(info!.type) : "");
const bgColorDark = $derived(hasInfo ? getTileTypeCssColorDark(info!.type) : "");

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

<key-view
    onclick={() => !disabled && onClick()}
    tabindex="0"
    class:small
    class:has-color={hasInfo && info!.type !== TileColor.Empty}
    class:must
    class:must-not={mustNot}
    class:disabled
    style:background={bgColor}
    style:--box-shadow-color={bgColorDark}
>
    {label}
</key-view>

<style lang="scss">
key-view {
    --box-shadow-color: #bfbdc7;

    display: grid;
    place-items: center;
    background: #ececec;
    box-shadow: 0 0.25rem var(--box-shadow-color);
    width: 2rem;
    height: 3rem;
    border-radius: 0.5rem;

    transition:
        background 0.175s ease-in-out,
        box-shadow 0.175s ease-in-out,
        color 0.175s ease-in-out,
        opacity 0.5s cubic-bezier(.14,.67,.2,1.43),
        transform 0.5s cubic-bezier(.14,.67,.2,1.43),
        filter 0.25s ease-in-out;

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
        filter: brightness(0.85);
    }

    &.has-color {
        color: #fff;
    }

    &.disabled {
        opacity: 0.3333333;
        transform: scale(0.85);
        pointer-events: none;
    }

    cursor: pointer;
}
</style>