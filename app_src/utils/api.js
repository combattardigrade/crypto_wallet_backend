const API = process.env.API_HOST

export function login(params) {
    return fetch(API + 'login', {
        method: 'POST',
        body: JSON.stringify(params),
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include'
    })
}

export function signup(params) {
    return fetch(API + 'signup', {
        method: 'POST',
        body: JSON.stringify(params),
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

export function getUserData(params) {
    return fetch(API + 'user', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + params.token
        }
    })
}

export function getUserDetails(params) {
    return fetch(API + 'user/' + params.userId, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + params.token
        }
    })
}

export function getTxs(params) {
    return fetch(API + 'txs', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + params.token
        }
    })
}

export function getRankings(params) {
    return fetch(API + 'rankings/' + params.period, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + params.token
        }
    })
}

export function getTxReasons(params) {
    return fetch(API + 'txReasons', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + params.token
        }
    })
}

export function getContacts(params) {
    return fetch(API + 'contacts', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + params.token
        }
    })
}

export function searchContact(params) {
    return fetch(API + 'searchContact', {
        method: 'POST',
        body: JSON.stringify(params),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + params.token
        }
    })
}

export function addContact(params) {
    return fetch(API + 'contact', {
        method: 'POST',
        body: JSON.stringify(params),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + params.token
        }
    })
}

export function deleteContact(params) {
    return fetch(API + 'contact/' + params.contactId, {
        method: 'DELETE',
        body: JSON.stringify(params),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + params.token
        }
    })
}

export function sendInternalTx(params) {
    return fetch(API + 'sendInternalTx', {
        method: 'POST',
        body: JSON.stringify(params),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + params.token
        }
    })
}

export function getInbox(params) {
    return fetch(API + 'paymentRequests/PENDING_APPROVAL', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + params.token
        }
    })
}

export function getPaymentRequest(params) {
    return fetch(API + 'paymentRequest/' + params.paymentRequestId, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + params.token
        }
    })
}

export function getRequestsSent(params) {
    return fetch(API + 'paymentRequestsSent', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + params.token
        }
    })
}

export function approvePaymentRequest(params) {
    return fetch(API + 'approvePaymentRequest/' + params.requestId, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + params.token
        }
    })
}
export function rejectPaymentRequest(params) {
    return fetch(API + 'rejectPaymentRequest/' + params.requestId, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + params.token
        }
    })
}

export function cancelPaymentRequest(params) {
    return fetch(API + 'cancelPaymentRequest/' + params.requestId, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + params.token
        }
    })
}

export function withdrawTokens(params) {
    return fetch(API + 'withdrawTokens', {
        method: 'POST',
        body: JSON.stringify(params),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + params.token
        }
    })
}

export function getKeycloakToken(params) {
    return fetch(API + 'getKeycloakToken', {
        method: 'POST',
        body: JSON.stringify(params),
        headers: {
            'Content-Type': 'application/json',
        }
    })
}

export function getKeycloakTokenWithAuthCode(params) {
    return fetch(API + 'getKeycloakTokenWithAuthCode', {
        method: 'POST',
        body: JSON.stringify(params),
        headers: {
            'Content-Type': 'application/json',
        },
    })
}

export function keycloakLogin(params) {
    return fetch(API + 'keycloakLogin', {
        method: 'POST',
        body: JSON.stringify(params),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + params.token
        }
    })
}
