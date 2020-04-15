module.exports.sendJSONresponse = function (res, status, content) {
    res.status(status)
    res.json(content)
}

module.exports.checkSequentialCharacters = function (s) {
    // check for sequential numerical characters
    for (let i in s) {
        if (+s[+i + 1] == +s[i] + 1 && +s[+i + 2] == +s[i] + 2)
            return false
    }

    // check for sequential alphabetical characters
    for (let i in s) {
        if (String.fromCharCode(s.charCodeAt(i) + 1) == s[+i + 1] &&
            String.fromCharCode(s.charCodeAt(i) + 2) == s[+i + 2]) {
            return false
        }
    }

    // check if characters are repeat more than twice
    if (/([A-Za-z0-9])\1{2}/.test(s)) {
        return false
    }

    return true
}

module.exports.removeSpanishChars = function (s) {
    s = s.replace("%E1", "a");
    s = s.replace("%E9", "e");
    s = s.replace("%ED", "i");
    s = s.replace("%F3", "o");
    s = s.replace("%FA", "u");
    s = s.replace("%F1", "n");
    s = s.replace("%C1", "Á");
    s = s.replace("%C9", "É");
    s = s.replace("%CD", "Í");
    s = s.replace("%D3", "Ó");
    s = s.replace("%DA", "Ú");
    s = s.replace("%D1", "Ñ");
    return s;
}
