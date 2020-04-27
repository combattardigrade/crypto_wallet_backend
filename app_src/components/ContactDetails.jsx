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

// Locales
import en from '../locales/en'
import fr from '../locales/fr'
import nl from '../locales/nl'
import es from '../locales/es'
import pt from '../locales/pt'
import ja from '../locales/ja'
import zh from '../locales/zh'
const LOCALES = { en, fr, nl, es, pt, ja, zh }

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
        const { token, lan } = this.props
        const { contacts } = this.state

        confirmAlert({
            title: LOCALES[lan]['web_wallet']['confirmation'],
            message: 'Are you sure you want to delete this contact?',
            buttons: [
                {
                    label: LOCALES[lan]['web_wallet']['yes'],
                    onClick: () => {
                        deleteContact({ contactId, token })
                        this.setState({
                            contacts: contacts.filter(c => c.id !== contactId)
                        })
                    }
                },
                {
                    label: LOCALES[lan]['web_wallet']['no'],
                    onClick: () => { }
                }
            ]
        });
    }

    render() {
        const { user, loading } = this.state
        const { lan } = this.props

        if (loading) {
            return <Loading />
        }

        return (
            <DashboardTemplate>
                <div className="page-content">
                    <nav className="page-breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link to="/contacts">{LOCALES[lan]['web_wallet']['user']}</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">{user.id}</li>
                        </ol>
                    </nav>

                    <div className="row mt-4">
                        <div className="col-md-6 col-xs-12 col-sm-12 grid-margin stretch-card">
                            <div className="card">
                                <div className="card-body">
                                    <div className="card-body">
                                        <h6 className="card-title">{LOCALES[lan]['web_wallet']['contact_details']}</h6>
                                        <div className="table-responsive">
                                            <table className="table table-hover" id="contactsTable">
                                                <thead>
                                                    <tr>
                                                        <td>{LOCALES[lan]['web_wallet']['field']}</td>
                                                        <td>{LOCALES[lan]['web_wallet']['value']}</td>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>ID</td>
                                                        <td>{user.id}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>{LOCALES[lan]['web_wallet']['first_name']}</td>
                                                        <td>{user.firstName}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>{LOCALES[lan]['web_wallet']['last_name']}</td>
                                                        <td>{user.lastName}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>{LOCALES[lan]['web_wallet']['username']}</td>
                                                        <td>{user.username}</td>
                                                    </tr>                                                    
                                                    <tr>
                                                        <td>{LOCALES[lan]['web_wallet']['delete_contact']}</td>
                                                        <td><button onClick={e => { e.preventDefault(); this.handleDeleteContact(user.id)}} className="btn btn-danger mr-2">{LOCALES[lan]['web_wallet']['delete']}</button></td>
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


function mapStateToProps({ auth, language }) {
    return {
        token: auth && auth.token,
        lan: language ? language : 'en'
    }   
}
export default connect(mapStateToProps)(ContactDetails)
