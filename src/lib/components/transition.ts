import { crossfade, fade } from "svelte/transition";

export const [send, receive] = crossfade({
    fallback(node, {duration, delay, easing}, intro) {
        return {
            duration: typeof duration === "function" ? duration(0) : duration,
            delay,
            easing,
            css: (t: number) => `opacity: ${t};`,
        };
    },
});


export const flipLeft = (node: HTMLElement, {duration, delay}: {duration: number, delay: number}) => {
    return {
        duration,
        delay,
        css: (t: number, u: number) => `transform: rotateY(${u * 0.25}turn);`,
    };
};

export const flipRight = (node: HTMLElement, {duration, delay}: {duration: number, delay: number}) => {
    return {
        duration,
        delay,
        css: (t: number, u: number) => `transform: rotateY(-${u * 0.25}turn);`,
    };
};