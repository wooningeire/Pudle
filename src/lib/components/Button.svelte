<script lang="ts">
import type { Snippet } from "svelte";

const {
    children,
    onClick,
}: {
    children: Snippet,
    onClick: () => (Promise<boolean> | boolean),
} = $props();

let shouldFlash = $state(false);
let buttonEl = $state<HTMLButtonElement | null>(null);

const handleClick = async () => {
    shouldFlash = false;
    const nextFlash = await Promise.resolve(onClick());
    setTimeout(() => {
        void buttonEl!.offsetHeight; // force reflow
        shouldFlash = nextFlash;
    });
};
</script>

<button-container>
    <button
        onclick={handleClick}
        class:success={shouldFlash}
        bind:this={buttonEl}
    >
        {@render children()}
    </button>

    <button-shadow>

    </button-shadow>
</button-container>

<style lang="scss">
button {
    --box-shadow-color: var(--button-bg-dark);

    display: block;
    border: none;
    background: var(--button-bg);
    font-family: inherit;
    font-size: 1em;
    color: inherit;
    width: 100%;

    padding: 0.5rem 1rem;
    cursor: pointer;
    border-radius: 1rem;
    box-shadow: -0.25rem -0.25rem var(--box-shadow-color);

    transition:
        transform 0.25s cubic-bezier(.14,1.51,.35,1),
        filter 0.125s ease-in-out,
        box-shadow 0.125s ease-in-out;

    &:hover,
    &:focus {
        transform: translateX(0.5rem);
        filter: brightness(1.125);
    }

    &:active {
        filter: brightness(0.85);
        animation: click-in 0.25s ease-out forwards;

        @keyframes click-in {
            0% {
                transform: translate(0rem -0.5rem);
            }
        }
    }

    &.success {
        animation: flash-green 0.5s forwards;

        @keyframes flash-green {
            0% {
                background: var(--light-green);
                --box-shadow-color: var(--tile-green);
            }
            50% {
                background: var(--light-green);
                --box-shadow-color: var(--tile-green);
            }
        }
    }
}
</style>