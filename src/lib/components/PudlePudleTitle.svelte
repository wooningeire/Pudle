<!-- <script lang="ts" module>
const titleKey = Symbol("pudle title key");
</script> -->

<script lang="ts">
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
        <pudle-pudle-title>Pudle Pudle</pudle-pudle-title>
        <pudle-pudle-credit>
            by
            <a
                href="https://vaie.art"
                target="_blank"
            >
                vaiezzell
            </a>
        </pudle-pudle-credit>
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
        mask: linear-gradient(#000 45%, #0000 65%);
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
        background: var(--tile-green);
        animation: spin-ccw-crossfade 40s infinite linear;

        @keyframes spin-ccw-crossfade {
            0% {
                transform: rotate(0turn);
                background: var(--tile-green);
            }
            33.33333% {
                background: var(--tile-yellow);
            }
            66.66667% {
                background: var(--tile-gray);
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
    line-height: 0.9;
    position: relative;
}

pudle-pudle-title {
    font-size: 3rem;
    font-weight: 700;
}
pudle-pudle-credit {
    font-size: 1.5rem;
}

</style>