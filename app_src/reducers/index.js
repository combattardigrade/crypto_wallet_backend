import { combineReducers } from 'redux'
import loading from './loading'
import auth from './auth'
import user from './user'
import inbox from './inbox'
import sidebar from './sidebar'
import language from './language'
import storage from 'redux-persist/lib/storage'

const appReducer = combineReducers({    
    loading,
    auth,    
    user,
    inbox,
    sidebar,
    language,
})

const rootReducer = (state, action) => {    
    if(action.type == 'USER_LOGOUT') {
        storage.removeItem('persist:root')
        state = undefined
    }
    return appReducer(state, action)
}

export default rootReducer