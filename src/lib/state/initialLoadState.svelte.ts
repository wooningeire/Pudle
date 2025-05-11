
import { createWordGetter } from "$lib/words.ts";

type InitialLoadServices = {
    words: Awaited<ReturnType<typeof createWordGetter>>,
};

const servicePromise = Promise.withResolvers<InitialLoadServices>();

export const initialLoadState = {
    services: servicePromise.promise,
};


export const setupInitialLoad = async () => {
    const services = {
        words: await createWordGetter(),
    };

    servicePromise.resolve(services);
};