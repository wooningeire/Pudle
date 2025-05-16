const settingsStateDefaults = {
    matchTileColor: "#66a166",
    misplacedTileColor: "#bbb660",
    absentTileColor: "#7c7c81",
    bgFrozen: false,
};

export const settingsState = $state({...settingsStateDefaults});

export const revertToDefaultSettings = () => {
    Object.assign(settingsState, settingsStateDefaults);
};

const LOCAL_STORAGE_KEY = "pudle";

export const setupPersistentSettings = () => {
    const existingSettingsJson = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (existingSettingsJson !== null) {
        Object.assign(settingsState, JSON.parse(existingSettingsJson));
    }

    $effect(() => {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(settingsState));
    });
};