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
});

export const noticeEvent = new EventTarget();

let nextId = 0n;

const nextMessageId = () => nextId++;


export const addTemporaryMessage = async (message: NoticeMessage) => {
    const remove = addMessage(message);
    setTimeout(remove, 2000);
};

export const addMessage = (message: NoticeMessage) => {
    const id = nextMessageId();

    noticeState.messages.set(id, message);

    emitMessage(message, id);

    return () => {
        noticeState.messages.delete(id);
    };
};

export const emitMessage = (message: NoticeMessage, id: bigint=nextMessageId()) => {
    noticeEvent.dispatchEvent(new CustomEvent("message", {
        detail: message,
    }));
};