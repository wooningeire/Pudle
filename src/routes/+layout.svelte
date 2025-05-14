<script lang="ts">
import type { Snippet } from "svelte";
import "#/index.scss";
// import iconUrl from "$lib/assets/icon.svg";
// import posterUrl from "$lib/assets/poster.png";
    import { page } from "$app/state";


const {
    children,
}: {
    children: Snippet,
} = $props();


const title = "Pudle";
const siteName = "vaiezzell’s web toys";
const description = "The timed Wordle × Puyo Puyo word stacking game I made in a weekend";
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

    <title>{title}</title>
    
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content="https://wooningeire.github.io/pudle/poster.png" />

    <meta property="og:title" content={title} />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content={siteName} />
    <meta property="og:url" content={page.url.toString()} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content="https://wooningeire.github.io/pudle/poster.png" />

    <meta name="description" content={description} />

    <meta name="theme-color" content="#66a166" />
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