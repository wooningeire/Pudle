<script lang="ts">
import type { Snippet } from "svelte";
import "#/index.scss";
import iconUrl from "$lib/assets/icon.svg";
    import { page } from "$app/state";


const {
    children,
}: {
    children: Snippet,
} = $props();


const title = "Pudle";
const siteName = "vaiezzell’s web toys";
const description = "The timed Wordle × Puyo Puyo word stacking game";
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
	
    <link rel="icon" href={iconUrl} />
    
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content="" />
    <meta name="twitter:image" content="poster url" />

    <meta property="og:title" content={title} />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content={siteName} />
    <meta property="og:url" content={page.url.toString()} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content="poster url" />

    <meta name="description" content={description} />
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