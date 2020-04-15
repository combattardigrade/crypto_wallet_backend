import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'

// Components
import Sidebar from './Sidebar'
import Navbar from './Navbar'



class DashboardTemplate extends Component {
    
    
    render() {
        return (
            <Fragment>
                <Sidebar />
                <div className="page-wrapper">
                    <Navbar />
                    {this.props.children}
                </div>
            </Fragment>
        )
    }
}


export default DashboardTemplate