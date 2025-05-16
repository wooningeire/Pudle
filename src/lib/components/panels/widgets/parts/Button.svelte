<script lang="ts">
import type { Snippet } from "svelte";

const {
    children,
    onClick,
    moveDirection = "right",
    disabled = false,
}: {
    children: Snippet,
    onClick: () => (Promise<boolean> | boolean | void),
    moveDirection?: "left" | "right" | "up",
    disabled?: boolean,
} = $props();

let shouldFlash = $state(false);
let buttonEl = $state<HTMLButtonElement | null>(null);

const handleClick = async () => {
    buttonEl!.blur();
    shouldFlash = false;
    const nextFlash = await Promise.resolve(onClick() ?? true);
    setTimeout(() => {
        void buttonEl!.offsetHeight; // force reflow
        shouldFlash = nextFlash;
    });
};
</script>

<button-container
    class:success={shouldFlash}
    class:move-left={moveDirection === "left"}
    class:move-right={moveDirection === "right"}
    class:move-up={moveDirection === "up"}
    class:disabled
>
    <button
        onclick={handleClick}
        bind:this={buttonEl}
        {disabled}
    >
        {@render children()}
    </button>

    <button-shadow style:--base-shadow-offset="-0.5rem"></button-shadow>
    <button-shadow style:--base-shadow-offset="-1rem"></button-shadow>
    <button-shadow style:--base-shadow-offset="-1.5rem" class="has-drop-shadow"></button-shadow>
</button-container>

<style lang="scss">
button-container {
    --button-color: var(--button-bg);
    --box-shadow-color: var(--button-bg-dark);

    display: grid;
    place-items: stretch;
    transform-style: preserve-3d;

    > * {
        grid-area: 1/1;
        border-radius: 1rem;
    }

    transition:
        transform 0.25s cubic-bezier(.14,1.51,.35,1),
        filter 0.125s ease-in-out,
        opacity 0.125s ease-in-out;


    --hover-movement: 0, 0;

    &.move-left {
        --hover-movement: -0.5rem, 0;
    }

    &.move-up {
        --hover-movement: 0, -0.5rem;
    }

    &.move-right {
        --hover-movement: 0.5rem, 0;
    }
        
    &:has(button:hover, button:focus-within) {
        transform: translate(var(--hover-movement));

        > * {
            filter: brightness(1.125);
        }
    }

    &:has(button:active) {
        > * {
            filter: brightness(0.85);
        }
    }
}

button {
    background: var(--button-color);
    width: 100%;
    backface-visibility: hidden;

    padding: 0.5rem 1rem;
    cursor: pointer;

    border: 2px solid var(--box-shadow-color);

    transition:
        background 0.125s ease-in-out,
        filter 0.125s ease-in-out,
        color 0.125s ease-in-out;
}

button-shadow {
    // --shadow-offset: -0.625rem;
    transform: translateZ(var(--shadow-offset, var(--base-shadow-offset)));
    background: var(--box-shadow-color);
    backface-visibility: hidden;

    &.has-drop-shadow {
        box-shadow: 0 0 2rem var(--box-shadow-color);
    }

    transition:
        background 0.125s ease-in-out,
        filter 0.125s ease-in-out,
        transform 0.25s ease-in-out,
        box-shadow 0.25s ease-in-out,
        opacity 0.125s ease-in-out;
}

.success {
    button {
        animation: flash-green-button 0.5s forwards;

        @keyframes flash-green-button {
            0%,
            50% {
                background: var(--tile-match);
                border-color: var(--tile-green-dark);
                color: #fff;
            }
        }
    }

    
    button-shadow {
        animation: flash-green-shadow 0.5s forwards;

        @keyframes flash-green-shadow {
            0%,
            50% {
                background: var(--tile-green-dark);
            }
        }
    }
}

button-container.disabled {
    pointer-events: none;

    button {
        opacity: 0.3333333;
    }
    
    button-shadow {
        --shadow-offset: -0.0625rem;
        opacity: 0;
        box-shadow: 0 0 0 #0000;
    }
}
</style>