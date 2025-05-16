<script>
    import SettingsButton from "./widgets/SettingsButton.svelte";

</script>
<right-panel-only-settings-button>
    <right-panel-bottom>
        <SettingsButton />
    </right-panel-bottom>
</right-panel-only-settings-button>


<style lang="scss">
@import "#/constants.scss";

* {
    transform-style: preserve-3d;
}

right-panel-only-settings-button {
    grid-area: 2/3 / 4/4;
    justify-self: center;
    align-self: end;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;

    transform: rotateY(-35deg) scale(var(--scale-fac));
    transform-origin: left;
    backface-visibility: hidden;


    --scale-fac: 1;
    @media screen and (max-width: $small-width) {
        --scale-fac: 0.75;
    }
}

right-panel-bottom {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}
</style>