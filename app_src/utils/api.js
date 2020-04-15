const API = 'http://localhost:3000/api/'

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

export function checkAdminAuth(params) {
    return fetch(API + 'admin/checkPrivileges', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + params.token
        }
    })
}

export function getAllUsersByType(params) {
    return fetch(API + `admin/getAllUsersByTypeAndPage/${params.accountType}/${params.page}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + params.token
        }
    })
}

export function getRequiredDocuments(params) {
    return fetch(API + `requiredDocuments`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + params.token
        }
    })
}

export function getRequiredDocument(params) {
    return fetch(API + `requiredDocument/${params.documentId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + params.token
        }
    })
}

export function updateRequiredDocument(params) {
    return fetch(API + 'admin/requiredDocument', {
        method: 'PUT',
        body: JSON.stringify(params),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + params.token
        },
        credentials: 'include'
    })        
}

export function createRequiredDocument(params) {
    return fetch(API + 'admin/requiredDocument', {
        method: 'POST',
        body: JSON.stringify(params),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + params.token
        },
        credentials: 'include'
    })        
}

export function deleteRequiredDocument(params) {
    return fetch(API + `admin/requiredDocument/${params.documentId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + params.token
        }
    })
}

export function getServiceVehicles(params) {
    return fetch(API + `serviceVehicles`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + params.token
        }
    })
}

export function getServiceVehicle(params) {
    return fetch(API + `serviceVehicle/${params.vehicleId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + params.token
        }
    })
}

export function updateServiceVehicle(params) {
    return fetch(API + 'admin/serviceVehicle', {
        method: 'PUT',
        body: JSON.stringify(params),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + params.token
        },
        credentials: 'include'
    })        
}

export function createServiceVehicle(params) {
    return fetch(API + 'admin/serviceVehicle', {
        method: 'POST',
        body: JSON.stringify(params),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + params.token
        },
        credentials: 'include'
    })        
}

export function deleteServiceVehicle(params) {
    return fetch(API + `admin/serviceVehicle/${params.vehicleId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + params.token
        }
    })
}






// Notes
// CSRF tokens in cookies
// https://stackoverflow.com/questions/20504846/why-is-it-common-to-put-csrf-prevention-tokens-in-cookies
// Using cookies with react and redux 
// https://medium.com/@rossbulat/using-cookies-in-react-redux-and-react-router-4-f5f6079905dc
// cookies, jwt security
// https://medium.com/@jcbaey/authentication-in-spa-reactjs-and-vuejs-the-right-way-e4a9ac5cd9a3