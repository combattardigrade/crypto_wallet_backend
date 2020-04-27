import { SHOW_SIDEBAR, HIDE_SIDEBAR, RESET_SIDEBAR  } from '../actions/shared'

export default function sidebar(state = false, action) {
    switch(action.type) {
        case SHOW_SIDEBAR:
            return action.sidebar
        case HIDE_SIDEBAR:
            return action.sidebar
        case RESET_SIDEBAR:
            return action.sidebar
        default:
            return state
    }
}