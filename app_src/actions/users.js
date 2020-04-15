export const SAVE_USERS = 'SAVE_USERS'
import { getUsersByTypeAndLevel } from '../utils/api'

export function fetchUsers(accountType = 'USER', page = 1, cb) {
    return (dispatch) => {
        return getAllUsersByType({ accountType, page })
            .then(res => res.json())
            .then(res => {
                if(res.status === 'OK') {
                    //console.log(JSON.stringify(res.result[0]))
                    dispatch(saveUsers(res.result))
                    cb(res.count,res.pages)
                }
            })
    }
}

export function saveUsers(users) {
    return {
        type: SAVE_USERS,
        users
    }
}