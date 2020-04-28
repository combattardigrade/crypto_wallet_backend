export const SAVE_INBOX = 'SAVE_INBOX'

export function saveInbox(inbox) {
    return {
        type: SAVE_INBOX,
        inbox
    }
}