export const keyboardClick = (fn: () => void) =>
    (event: KeyboardEvent) => {
        if (!["Enter", " "].includes(event.key)) return;
        fn();
    };