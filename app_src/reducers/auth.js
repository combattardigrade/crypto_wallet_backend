import { SAVE_TOKEN } from '../actions/auth'

export default function auth(state = null, action) {
    switch(action.type) {
        case SAVE_TOKEN:
            return {
                ...state,
                token: action.token
            }
        
        default:
            return state
    }
}