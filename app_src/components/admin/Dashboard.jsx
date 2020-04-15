import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'

// Components
import DashboardTemplate from './DashboardTemplate'
import WelcomeBar from './WelcomeBar'





class Dashboard extends Component {
    

    render() {
        return (
            <DashboardTemplate>
                <WelcomeBar />
            </DashboardTemplate>
        )
    }
}


export default Dashboard