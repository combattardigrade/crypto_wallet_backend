import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'

// Components
import DashboardTemplate from './DashboardTemplate'
import WelcomeBar from './WelcomeBar'

// API
import { getUserData } from '../utils/api'

// Actions
import { saveUserData } from '../actions/user'

class Dashboard extends Component {
    
    componentDidMount() {
        const { token, dispatch } = this.props

        getUserData({ token })
            .then(data => data.json())
            .then((res) => {
                if(res.status === 'OK') {
                    dispatch(saveUserData(res.payload))
                }
            })
    }

    render() {
        return (
            <DashboardTemplate>
                <WelcomeBar />
            </DashboardTemplate>
        )
    }
}

function mapStateToProps({ auth }) {
    return {
        token: auth && auth.token,

    }
}

export default connect(mapStateToProps)(Dashboard)
