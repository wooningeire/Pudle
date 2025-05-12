import { crossfade, fade } from "svelte/transition";
import { swapout } from "./custom-crossfade";

export const [sendWithFade, receiveWithFade] = crossfade({
    fallback(node, {duration, delay, easing}, intro) {
        return {
            duration: typeof duration === "function" ? duration(0) : duration,
            delay,
            easing,
            css: (t: number) => `opacity: ${t};`,
        };
    },
});
export const {send, receive} = swapout({});


export const flipLeft = (node: HTMLElement, {duration, delay, easing, baseRot="0deg"}: {duration?: number, delay?: number, easing?: (t: number) => number, baseRot?: string}) => {
    return {
        duration,
        delay,
        easing,
        css: (t: number, u: number) => `transform: rotateY(calc(${u * 0.5}turn + ${baseRot}));`,
    };
};

export const flipRight = (node: HTMLElement, {duration, delay, easing, baseRot="0deg"}: {duration?: number, delay?: number, easing?: (t: number) => number, baseRot?: string}) => {
    return {
        duration,
        delay,
        easing,
        css: (t: number, u: number) => `transform: rotateY(calc(${u * -0.5}turn + ${baseRot}));`,
    };
};


export const halfFlipLeft = (node: HTMLElement, {duration, delay, easing, baseRot="0deg"}: {duration?: number, delay?: number, easing?: (t: number) => number, baseRot?: string}) => {
    return {
        duration,
        delay,
        easing,
        css: (t: number, u: number) => `transform: rotateY(calc(${u * 0.25}turn + ${baseRot}));`,
    };
};

export const halfFlipRight = (node: HTMLElement, {duration, delay, easing, baseRot="0deg"}: {duration?: number, delay?: number, easing?: (t: number) => number, baseRot?: string}) => {
    return {
        duration,
        delay,
        easing,
        css: (t: number, u: number) => `transform: rotateY(calc(${u * -0.25}turn + ${baseRot}));`,
    };
};

export const flipTop = (node: HTMLElement, {duration, delay, easing, baseRot="0deg"}: {duration?: number, delay?: number, easing?: (t: number) => number, baseRot?: string}) => {
    return {
        duration,
        delay,
        easing,
        css: (t: number, u: number) => `transform: rotateX(calc(${u * 0.5}turn + ${baseRot}));`,
    };
};

export const flipBottom = (node: HTMLElement, {duration, delay, easing, baseRot="0deg"}: {duration?: number, delay?: number, easing?: (t: number) => number, baseRot?: string}) => {
    return {
        duration,
        delay,
        easing,
        css: (t: number, u: number) => `transform: rotateX(calc(${u * -0.5}turn + ${baseRot}));`,
    };
};

export const flipBottomAndFade = (node: HTMLElement, {duration, delay, easing, baseRot="0deg"}: {duration?: number, delay?: number, easing?: (t: number) => number, baseRot?: string}) => {
    return {
        duration,
        delay,
        easing,
        css: (t: number, u: number) => `transform: rotateX(calc(${u * -0.5}turn + ${baseRot})); opacity: ${t};`,
    };
};