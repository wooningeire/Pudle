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
        href="https://fonts.googleapis.com/css2?family=Belanosima:wght@400;600;700&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Shanti&display=swap"
        rel="stylesheet"
    />
</svelte:head>