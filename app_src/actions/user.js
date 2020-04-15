export const SAVE_USER_DATA = 'SAVE_USER_DATA'

export function saveUserData(userData) {
    return {
        type: SAVE_USER_DATA,
        userData
    }
}
