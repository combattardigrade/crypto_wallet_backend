import { SAVE_LANGUAGE } from '../actions/language'

export default function device(state = null, action) {
    switch (action.type) {
        case SAVE_LANGUAGE:
            return  action.language   
        default:
            return state
    }
}