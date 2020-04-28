import { SAVE_INBOX } from '../actions/inbox'

export default function inbox(state = null, action) {
    switch (action.type) {
        case SAVE_INBOX:
            return  {
                ...action.inbox
            }
        default:
            return state
    }
}