<script lang="ts">
    import { gameState } from "./gameState.svelte";
    import { getTileTypeCssColor, getTileTypeCssColorDark } from "./tileColors";
    import { uiState } from "./uiState.svelte";

const {
    onClick,
    label,
    small = false,
    colorable = false,
}: {
    onClick: () => void,
    label: string,
    small?: boolean,
    colorable?: boolean,
} = $props();

const hasInfo = $derived(colorable && gameState.knownLetterInfo.has(label));
const info = $derived(hasInfo ? gameState.knownLetterInfo.get(label)! : null);
const bgColor = $derived(hasInfo ? getTileTypeCssColor(info!.type) : "");
const bgColorDark = $derived(hasInfo ? getTileTypeCssColorDark(info!.type) : "");

const must = $derived(colorable && !uiState.gameOver && (info?.mustBeInPositions.has(uiState.guess.length) ?? false));
const mustNot = $derived(colorable && !uiState.gameOver && (uiState.guess.length === 5 || (info?.mustNotBeInPositions.has(uiState.guess.length) ?? false)));
</script>

<key-view
    onclick={onClick}
    tabindex="0"
    class:small
    class:has-info={hasInfo}
    class:must
    class:must-not={mustNot}
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
        transform 0.5s cubic-bezier(.14,.67,.2,1.43);

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
        opacity: 0.4;
        transform: scale(0.85);
    }

    &.has-info {
        color: #fff;
    }

    cursor: pointer;
}
</style>