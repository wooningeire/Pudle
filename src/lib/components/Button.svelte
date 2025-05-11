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

<button-container
    class:success={shouldFlash}
>
    <button
        onclick={handleClick}
        bind:this={buttonEl}
    >
        {@render children()}
    </button>

    <button-shadow>

    </button-shadow>
</button-container>

<style lang="scss">
button-container {
    display: grid;
    place-items: stretch;
    transform-style: preserve-3d;

    > * {
        grid-area: 1/1;
        border-radius: 1rem;
    }

    transition:
        transform 0.25s cubic-bezier(.14,1.51,.35,1),
        filter 0.125s ease-in-out;
        
    &:has(button:hover, button:focus-within) {
        transform: translateX(0.5rem);
    }
}

button {
    --button-color: var(--button-bg);

    display: block;
    border: none;
    background: var(--button-color);
    font-family: inherit;
    font-size: 1em;
    color: inherit;
    width: 100%;
    backface-visibility: hidden;

    padding: 0.5rem 1rem;
    cursor: pointer;

    transition:
        background 0.125s ease-in-out,
        filter 0.125s ease-in-out;

    &:hover,
    &:focus {
        filter: brightness(1.125);

        + button-shadow {
            filter: brightness(1.125);
        }
    }

    &:active {
        filter: brightness(0.85);
        

        + button-shadow {
            filter: brightness(0.85);
        }
    }
}

button-shadow {
    --box-shadow-color: var(--button-bg-dark);

    transform: translateZ(-1.5rem);
    background: var(--box-shadow-color);
    backface-visibility: hidden;

    transition:
        background 0.125s ease-in-out,
        filter 0.125s ease-in-out;
}

.success {
    button {
        animation: flash-green-button 0.5s forwards;

        @keyframes flash-green-button {
            0% {
                background: var(--light-green);
            }
            50% {
                background: var(--light-green);
            }
        }
    }

    
    button-shadow {
        animation: flash-green-shadow 0.5s forwards;

        @keyframes flash-green-shadow {
            0% {
                background: var(--tile-green);
            }
            50% {
                background: var(--tile-green);
            }
        }
    }
}
</style>