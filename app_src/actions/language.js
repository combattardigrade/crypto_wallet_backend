export const SAVE_LANGUAGE = 'SAVE_LANGUAGE'

export function saveLanguage(language) {
    return {
        type: SAVE_LANGUAGE,
        language
    }
}