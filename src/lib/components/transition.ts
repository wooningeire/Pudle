import { crossfade, fade } from "svelte/transition";
import { cubicInOut, cubicOut } from "svelte/easing";
import type { CrossfadeParams, TransitionConfig } from "svelte/transition";


export type SwapoutParams = {
    key: any,
    delay?: number,
    duration?: number | ((distance: number) => number),
    easing?: (time: number) => number,
};

export const swapout = ({ fallback, ...defaults }: CrossfadeParams & {
    fallback?: (node: Element, params: CrossfadeParams, into: boolean) => TransitionConfig,
}) => {
    const nodesToBeReceived: Map<any, Element> = new Map();
    const nodesToBeSent: Map<any, Element> = new Map();

    const createTransitionConfig = (fromNode: Element, toNode: Element, params: CrossfadeParams): TransitionConfig => {
        const {
            delay = 0,
            duration = (distance: number) => Math.sqrt(distance) * 30,
            easing = cubicInOut,
        } = {...defaults, ...params};

        const srcRect = fromNode.getBoundingClientRect();
        const dstRect = toNode.getBoundingClientRect();

        const distanceX = srcRect.left - dstRect.left;
        const distanceY = srcRect.top - dstRect.top;
        const distance = Math.hypot(distanceX, distanceY);

        return {
            delay,
            duration: typeof duration === 'function' ? duration(distance) : duration,
            easing,
            css: (t, u) => `
transform-origin: top left;
transform: translate(${u * distanceX}px, ${u * distanceY}px);
opacity: ${t < 0.5 ? "0" : "1"};
`
        };
    };

    const transition = (items: Map<any, Element>, counterparts: Map<any, Element>, intro: boolean) => {
        return (node: Element, params: SwapoutParams) => {
            items.set(params.key, node);
            return () => {
                if (counterparts.has(params.key)) {
                    const otherNode = counterparts.get(params.key);
                    counterparts.delete(params.key);

                    return createTransitionConfig(<Element>otherNode, node, params);
                }
                items.delete(params.key);
                return fallback && fallback(node, params, intro);
            };
        };
    };
    return {
        send: transition(nodesToBeSent, nodesToBeReceived, false),
        receive: transition(nodesToBeReceived, nodesToBeSent, true),
    };
};


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