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
    emittedMessage: <{id: bigint, message: NoticeMessage} | null>null,
});

let nextId = 0n;

const nextMessageId = () => nextId++;


export const addTemporaryMessage = async (message: NoticeMessage) => {
    const remove = await addMessage(message);
    setTimeout(remove, 2000);
};

export const addMessage = async (message: NoticeMessage) => {
    const id = nextMessageId();

    noticeState.messages.set(id, message);

    await emitMessage(message, id);

    return () => {
        noticeState.messages.delete(id);
    };
};

export const emitMessage = async (message: NoticeMessage, id: bigint=nextMessageId()) => {
    if (noticeState.emittedMessage !== null) {
        noticeState.emittedMessage = null;
        await tick();
    }
    noticeState.emittedMessage = {id, message};

    tick().then(() => {
        noticeState.emittedMessage = null;
    })
};