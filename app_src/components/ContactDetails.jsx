import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Link } from "react-router-dom";
// Components
import DashboardTemplate from './DashboardTemplate'

// Components
import Loading from './Loading'

// API
import { getUserDetails } from '../utils/api'

// Libraries
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

class ContactDetails extends Component {

    state = {
        user: '',
        loading: true
    }

    componentDidMount() {
        const { token, dispatch } = this.props
        let { userId } = this.props.match.params
        console.log(userId)

        getUserDetails({ userId, token })
            .then(data => data.json())
            .then((res) => {
                if (res.status === 'OK') {
                    console.log(res.payload)
                    this.setState({ loading: false, user: res.payload })
                }
            })
    }

    handleDeleteContact = (contactId) => {
        const { token } = this.props
        const { contacts } = this.state

        confirmAlert({
            title: 'Confirmation',
            message: 'Are you sure you want to delete this contact?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        deleteContact({ contactId, token })
                        this.setState({
                            contacts: contacts.filter(c => c.id !== contactId)
                        })
                    }
                },
                {
                    label: 'No',
                    onClick: () => { }
                }
            ]
        });
    }

    render() {
        const { user, loading } = this.state

        if (loading) {
            return <Loading />
        }

        return (
            <DashboardTemplate>
                <div className="page-content">
                    <nav className="page-breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="#">Usuario</a></li>
                            <li className="breadcrumb-item active" aria-current="page">{user.id}</li>
                        </ol>
                    </nav>

                    <div className="row mt-4">
                        <div className="col-md-6 col-xs-12 col-sm-12 grid-margin stretch-card">
                            <div className="card">
                                <div className="card-body">
                                    <div className="card-body">
                                        <h6 className="card-title">Contact Details</h6>
                                        <div className="table-responsive">
                                            <table className="table table-hover" id="contactsTable">
                                                <thead>
                                                    <tr>
                                                        <td>Field</td>
                                                        <td>Value</td>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>ID</td>
                                                        <td>{user.id}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>First Name</td>
                                                        <td>{user.firstName}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Last Name</td>
                                                        <td>{user.lastName}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Username</td>
                                                        <td>{user.username}</td>
                                                    </tr>                                                    
                                                    <tr>
                                                        <td>Delete Contact</td>
                                                        <td><button onClick={e => { e.preventDefault(); this.handleDeleteContact(user.id)}} className="btn btn-danger mr-2">Delete</button></td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>                                        
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </DashboardTemplate>
        )
    }
}


function mapStateToProps({ auth }) {
    return {
        token: auth && auth.token,

    }
}
export default connect(mapStateToProps)(ContactDetails)
