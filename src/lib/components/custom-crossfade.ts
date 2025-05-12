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