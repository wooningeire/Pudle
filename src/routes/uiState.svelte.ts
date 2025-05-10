export const uiState = $state({
    nextTileId: 0n,
});

export const nextTileId = () => uiState.nextTileId++;