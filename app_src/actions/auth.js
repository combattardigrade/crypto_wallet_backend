import { login, getLoginCSRFToken } from '../utils/api'
import { showLoading, hideLoading } from './shared'
export const SAVE_TOKEN = 'SAVE_TOKEN'


export function handleLogin(params, cb) {
    
    return (dispatch) => {
        return login(params)
            .then(res => res.json())            
            .then((res) => {                      
                // save token in store
                if(res.token) {
                    dispatch(saveToken(res.token))
                }                 
                cb(res)
            })
            .catch((err) => {             
                console.log(err)   
                
            })
    }
}

export function saveToken(token) {
    return {
        type: SAVE_TOKEN,
        token
    }
}

export function logout() {
    return {
        type: USER_LOGOUT
    }
}
