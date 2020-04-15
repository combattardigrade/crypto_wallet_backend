import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Link } from "react-router-dom";
// Components
import DashboardTemplate from './DashboardTemplate'
import ReactLoading from 'react-loading';

// Components
import Loading from './Loading'

// API
import { getContacts, deleteContact } from '../utils/api'

// Libraries
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

import { PlusCircle } from 'react-feather';


class Contacts extends Component {

    state = {
        contacts: '',
        loading: true
    }

    componentDidMount() {
        const { token } = this.props

        getContacts({ token })
            .then(data => data.json())
            .then((res) => {
                if (res.status === 'OK') {
                    console.log(res.payload)
                    this.setState({ loading: false, contacts: res.payload })
                }
            })
    }

    handleAddContact = (e) => {
        e.preventDefault()
        this.props.history.push('/add-contact')
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
        const { contacts, loading } = this.state

        if (loading) {
            return <Loading />
        }

        return (
            <DashboardTemplate>
                <div className="page-content">
                    <nav className="page-breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="#">Contacts</a></li>
                            <li className="breadcrumb-item active" aria-current="page">All</li>
                        </ol>
                    </nav>

                    <div className="row mt-4">
                        <div className="col-md-12 grid-margin stretch-card">
                            <div className="card">
                                <div className="card-body">
                                    <h6 className="card-title">Contacts</h6>
                                    <div style={{ marginBottom: '10px' }}>
                                        <ReactHTMLTableToExcel
                                            className="btn btn-light mb-1 "
                                            table="contactsTable"
                                            filename="contacts"
                                            sheet="contacts"
                                            buttonText="Excel"
                                        />
                                        <div style={{ float: "right", display: 'flex' }}>                                            
                                            <button onClick={this.handleAddContact} type="button" className="btn btn-primary btn-icon-text mb-2 mb-md-0"><PlusCircle size="16" />Add Contact</button>
                                        </div>
                                    </div>
                                    <div className="table-responsive">
                                        <table className="table table-hover" id="contactsTable">
                                            <thead>
                                                <tr>
                                                    <td>ID</td>
                                                    <td>Name</td>
                                                    <td>Username</td>
                                                    <td>Email</td>                                                    
                                                    <td>Action</td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    contacts && contacts.length > 0
                                                        ?
                                                        contacts.map((contact, index) => (
                                                            <tr key={index}>
                                                                <td>{contact.id}</td>
                                                                <td>{contact.firstName + ' ' + contact.lastName}</td>
                                                                <td>{contact.username}</td>
                                                                <td>{contact.email}</td>   
                                                                <td>
                                                                    <Link to={`/contact/${contact.id}`} className="btn btn-primary mb-1 mb-md-0 action-btn"><i className="fa fa-search btn-icon"></i></Link>
                                                                    <button onClick={e => { e.preventDefault(); this.handleDeleteContact(contact.id) }} type="button" className="btn btn-danger mb-1 mb-md-0 action-btn"><i className="fa fa-trash btn-icon"></i></button>
                                                                </td>
                                                            </tr>
                                                        ))
                                                        :
                                                        <tr>
                                                            <td>-</td>
                                                            <td>-</td>
                                                            <td>-</td>
                                                            <td>-</td>
                                                            <td>-</td>
                                                            
                                                        </tr>
                                                }
                                            </tbody>
                                        </table>
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
export default connect(mapStateToProps)(Contacts)
