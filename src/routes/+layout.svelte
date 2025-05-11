<script lang="ts">
import type { Snippet } from "svelte";
import "#/index.scss";

const {
    children,
}: {
    children: Snippet,
} = $props();
</script>

{@render children()}

<svelte:head>
    <link
        rel="preconnect"
        href="https://fonts.googleapis.com"
    />
    <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossorigin
    />
    <link
        href="https://fonts.googleapis.com/css2?family=Belanosima:wght@400;700&display=swap"
        rel="stylesheet"
    />
</svelte:head>

<style lang="scss">
@import "#/constants.scss";
:global(:root) {
    @media screen and (max-height: $small-height), (max-width: $xxsmall-width) {
        font-size: 0.85em;

        @media screen and (max-height: $xsmall-height) {
            font-size: 0.65em;
        }
    }
}
</style>