import { combineReducers } from 'redux'
import loading from './loading'
import auth from './auth'
import storage from 'redux-persist/lib/storage'

const appReducer = combineReducers({    
    loading,
    auth,    
})

const rootReducer = (state, action) => {    
    if(action.type == 'USER_LOGOUT') {
        storage.removeItem('persist:root')
        state = undefined
    }
    return appReducer(state, action)
}

export default rootReducer