export enum NoticeMessage {
    SelectBlueTile,
    NotInWordList,
    AlreadyGuessedThisRound,
    ColumnBlocked,
}

export const noticeState = $state({
    currentMessage: <NoticeMessage | null>null,
});

let currentTimeout = <number | null>null;

export const setTemporaryMessage = (message: NoticeMessage) => {
    if (currentTimeout !== null) {
        clearTimeout(currentTimeout);
    }

    noticeState.currentMessage = message;
    currentTimeout = setTimeout(() => {
        noticeState.currentMessage = null;
    }, 2000);
};