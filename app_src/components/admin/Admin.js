import React, { Component, Fragment } from 'react'
import { Redirect, Route } from 'react-router-dom'
import { connect } from 'react-redux'
// Components
import withAdminAuth from '../withAdminAuth'
import AdminLogin from './AdminLogin'
import Dashboard from './Dashboard'
import Users from './Users'
import AddUser from './AddUser'
import EditUser from './EditUser'
import Drivers from './Drivers'
import EditDriver from './EditDriver'
import RequiredDocuments from './RequiredDocuments'
import EditRequiredDocument from './EditRequiredDocument'
import AddRequiredDocument from './AddRequiredDocument'
import ServiceVehicles from './ServiceVehicles'
import EditServiceVehicle from './EditServiceVehicle'
import AddServiceVehicle from './AddServiceVehicle'


class Admin extends Component {
    render() {
        const { match, auth } = this.props
        return (
            < Fragment >
                <Route path={match.path} exact component={AdminLogin} />
                <Route path={`${match.path}/login`} component={AdminLogin} />
                <PrivateRoute path={`${match.path}/dashboard`} component={Dashboard} auth={auth}/>
                <PrivateRoute path={`${match.path}/users/:page?`} component={Users} auth={auth}/>               
                <PrivateRoute path={`${match.path}/user/:userId/edit`} component={EditUser} auth={auth}/>
                <PrivateRoute path={`${match.path}/user/create`} component={AddUser} auth={auth}/>
                <PrivateRoute path={`${match.path}/drivers`} component={Drivers} auth={auth} />
                <PrivateRoute path={`${match.path}/driver/:userId/edit`} component={EditDriver} auth={auth} />
                <PrivateRoute path={`${match.path}/requiredDocuments`} component={RequiredDocuments} auth={auth} />
                <PrivateRoute path={`${match.path}/requiredDocument/:documentId/edit`} component={EditRequiredDocument} auth={auth} />
                <PrivateRoute path={`${match.path}/addRequiredDocument`} component={AddRequiredDocument} auth={auth} />
                <PrivateRoute path={`${match.path}/serviceVehicles`} component={ServiceVehicles} auth={auth} />
                <PrivateRoute path={`${match.path}/serviceVehicle/:vehicleId/edit`} component={EditServiceVehicle} auth={auth} />
                <PrivateRoute path={`${match.path}/addServiceVehicle`} component={AddServiceVehicle} auth={auth} />
                
            </Fragment >

        )
    }
}

function PrivateRoute({ component: Component, ...rest }) {
    const { auth } = rest
    return (
        <Route
            {...rest}
            render={props =>
                auth !== null ? (
                    <Component {...props} />
                )
                    : (
                        <Redirect
                            to={{
                                pathname: '/admin/login',
                                state: { from: props.location.pathname }
                            }}
                        />
                    )
            }
        />
    )
}

function mapStateToProps({  auth }) {
    return {
       
        auth
    }
}

export default connect(mapStateToProps)(Admin)



