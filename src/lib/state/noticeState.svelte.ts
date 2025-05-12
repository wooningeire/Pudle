import { tick } from "svelte";
import { SvelteMap, SvelteSet } from "svelte/reactivity";

export enum NoticeMessage {
    SelectBlueTile,
    NotInWordList,
    AlreadyGuessedThisRound,
    ColumnBlocked,
}


export const noticeState = $state({
    messages: new SvelteMap<bigint, NoticeMessage>(),
    newestMessage: <{id: bigint, message: NoticeMessage} | null>null,
});

let nextId = 0n;

const getNextId = () => nextId++;


export const addTemporaryMessage = async (message: NoticeMessage) => {
    const remove = await addMessage(message);
    setTimeout(remove, 2000);
};

export const addMessage = async (message: NoticeMessage) => {
    const id = getNextId();

    noticeState.messages.set(id, message);
    

    if (noticeState.newestMessage !== null) {
        noticeState.newestMessage = null;
        await tick();
    }
    noticeState.newestMessage = {id, message};

    return () => {
        noticeState.messages.delete(id);
    }
};