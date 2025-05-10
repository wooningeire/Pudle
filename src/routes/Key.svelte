<script lang="ts">
const {
    onClick,
    label,
    small = false,
}: {
    onClick: () => void,
    label: string,
    small?: boolean,
} = $props();
</script>

<key-view
    onclick={onClick}
    tabindex="0"
    class:small
>
    {label}
</key-view>

<style lang="scss">
key-view {
    display: grid;
    place-items: center;
    background: #ececec;
    box-shadow: 0 0.25rem #bfbdc7;
    width: 2rem;
    height: 3rem;
    border-radius: 0.5rem;
    
    &.small {
        font-size: 1rem;
    }

    cursor: pointer;
}
</style>