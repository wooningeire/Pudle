<!-- <script lang="ts" module>
const titleKey = Symbol("pudle title key");
</script> -->

<script lang="ts">
import VaiezzellLogo from "./VaiezzellLogo.svelte";

const {
    fades = false,
}: {
    fades?: boolean,
} = $props();

</script>

<!-- {#key titleKey}
in:receive|global={{key: titleKey, duration: 250}}
out:send|global={{key: titleKey, duration: 250}} -->
<title-container>
    <bg-graphic class:fades>
        <square-1></square-1>
        <square-2></square-2>
        <square-3></square-3>
    </bg-graphic>

    <title-text>
        <pudle-title>Pudle</pudle-title>
        <pudle-credit>
            by
            <a
                href="https://vaie.art"
                target="_blank"
            >
                <VaiezzellLogo />
            </a>
        </pudle-credit>
        <pudle-inspo>thanks <a href="https://spax.zone" target="_blank">spax</a> and <a href="https://oat.zone" target="_blank">oatmealine</a> for inspiration</pudle-inspo>
    </title-text>
</title-container>
<!-- {/key} -->

<style lang="scss">
title-container {
    grid-area: 1/1 / 2/-1;
    display: grid;
    place-items: center;
    > * {
        grid-area: 1/1;
    }

    margin-bottom: 0.75rem;
}

bg-graphic {
    position: absolute;
    display: grid;
    place-items: center;
    pointer-events: none;

    > * {
        grid-area: 1/1;
    }

    &.fades {
        mask: linear-gradient(#000 40%, #0000 60%);
    }


    opacity: 0.3333333;

    width: 20rem;
    height: 20rem;

    > square-1 {
        display: block;
        border: 4px solid #aaa;
        width: 7.5em;
        height: 7.5rem;
        animation: spin-cw 5s infinite linear;

        @keyframes spin-cw {
            0% {
                transform: rotate(0turn);
            }
            100% {
                transform: rotate(1turn);
            }
        }
    }

    > square-2 {
        display: block;
        border: 4px solid #aaa;
        width: 6.5em;
        height: 6.5rem;
        animation: spin-ccw 10s infinite linear;

        @keyframes spin-ccw {
            0% {
                transform: rotate(0turn);
            }
            100% {
                transform: rotate(-1turn);
            }
        }
    }
    > square-3 {
        display: block;
        width: 5em;
        height: 5rem;
        background: var(--tile-match);
        animation: spin-ccw-crossfade 40s infinite linear;

        @keyframes spin-ccw-crossfade {
            0% {
                transform: rotate(0turn);
                background: var(--tile-match);
            }
            33.33333% {
                background: var(--tile-misplaced);
            }
            66.66667% {
                background: var(--tile-absent);
            }
            100% {
                transform: rotate(-4turn);
            }
        }
    }
}

title-text {
    display: flex;
    flex-direction: column;
    align-items: center;
    line-height: 0.8;
    position: relative;
}

pudle-title {
    font-size: 3.5rem;
    font-weight: 700;
}
pudle-credit {
    font-size: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;

    a {
        border: none;
    }
    
    :global(svg) {
        height: 3rem;
        width: auto;

        :global(*) {
            fill: currentColor;
        }
    }
}

pudle-inspo {
    margin-top: -0.125rem;
    font-size: 1rem;
}

</style>