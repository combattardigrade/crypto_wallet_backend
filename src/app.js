
const moment = require('moment')
const App = {
    google: '',
    map: '',
    polyline: '',
    marker: '',
    token: '',
    renderPath: async (locations) => {
        let points = []
        const requestsArray = []
        for (let i = 0; i < 50; i++) {
            if (!locations[i + 1]) {
                break;
            }
            let request = App.getMapRoute({
                fromLocation: { lat: locations[i].lat, lng: locations[i].lng },
                toLocation: { lat: locations[i + 1].lat, lng: locations[i + 1].lng }
            })
            requestsArray.push(request)
        }
        const requests = await Promise.all(requestsArray)
        for (let r of requests) {
            let jsonobject = await r.json()
            let coordinates = jsonobject.routes[0].geometry.coordinates;
            await coordinates.map((point) => {
                points.push({ lat: point[1], lng: point[0] })
            })
        }
        console.log(points)
        return points
    },
    getMapRoute: (params) => {
        const from = [params.fromLocation.lng, params.fromLocation.lat]
        const to = [params.toLocation.lng, params.toLocation.lat]
        const URL = process.env.MAPBOX_DIRECTIONS_API + from.toString() + ';' + to.toString() + '?overview=full&geometries=geojson&access_token=' + process.env.MAPBOX_ACCESS_TOKEN
        return fetch(URL, {
            method: 'GET',
        })
    },
    fetchRoutes: (status) => {
        const URL = `${process.env.API_HOST}getRoutesByStatus/${status}`
        console.log(URL)
        return fetch(URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${App.token}`
            },
        })
            .then(data => data.json())
    },
    fetchRoute: (routeId) => {
        const URL = `${process.env.API_HOST}route/${routeId}`         
        return fetch(URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + App.token
            },
        })
            .then(data => data.json())
    },
    fetchLastUserLocation: (userId) => {
        const URL = `${process.env.API_HOST}getLastUserLocation/${userId}`
        return fetch(URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + App.token
            },
        })
            .then(data => data.json())
    },
    fetchCompanyActiveRoutes: () => {
        const URL = `${process.env.API_HOST}getCompanyRoutesByStatus/ACTIVE`
        return fetch(URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + App.token
            },
        })
            .then(data => data.json())
    },
    getCompanyGuards: () => {
        const URL = `${process.env.API_HOST}getAllActiveGuards`
        return fetch(URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + App.token
            },
        })
            .then(data => data.json())
    },
    getCompanyReports: () => {
        const URL = `${process.env.API_HOST}getCompanyReports`
        return fetch(URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + App.token
            },
        })
            .then(data => data.json())
    },
    getCompany24hReports: () => {
        const URL = `${process.env.API_HOST}getCompany24hReports`
        return fetch(URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + App.token
            },
        })
            .then(data => data.json())
    },
    getAccessLogsByCompany: () => {
        const URL = `${process.env.API_HOST}getAccessLogsByCompany`
        return fetch(URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + App.token
            },
        })
            .then(data => data.json())
    },
    bitacorasByCompany: () => {
        const URL = `${process.env.API_HOST}bitacorasByCompany`
        return fetch(URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + App.token
            },
        })
            .then(data => data.json())
    },
    fetchDashboardData: () => {
        const URL = `${process.env.API_HOST}admin/dashboardData`
        return fetch(URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + App.token
            },
        })
            .then(data => data.json())
    },
    fetchCarRouteLocations: (carRouteId) => {
        const URL = `${process.env.API_HOST}getCarRouteLocations/${carRouteId}`
        return fetch(URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + App.token
            },
        })
            .then(data => data.json())
    },
    fetchUserProfile: (userId) => {
        const URL = `${process.env.API_HOST}admin/userProfile/${userId}`
        return fetch(URL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ` + App.token
            },
        })
            .then(data => data.json())
    }
    

    
}

window.App = App

window.addEventListener("load", async function () {
    // App.getPlatformData()



});