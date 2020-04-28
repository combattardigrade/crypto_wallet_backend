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

// Locales
import en from '../locales/en'
import fr from '../locales/fr'
import nl from '../locales/nl'
import es from '../locales/es'
import pt from '../locales/pt'
import ja from '../locales/ja'
import zh from '../locales/zh'
const LOCALES = { en, fr, nl, es, pt, ja, zh }

class Contacts extends Component {

    state = {
        contacts: '',
        loading: true
    }

    componentDidMount() {
        const { token, lan } = this.props
        document.title = `${LOCALES[lan]['web_wallet']['contacts']} | Jiwards`

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
        const { token, lan } = this.props
        const { contacts } = this.state

        confirmAlert({
            title: LOCALES[lan]['web_wallet']['confirmation'],
            message: LOCALES[lan]['web_wallet']['contacts_confirmation'],
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
        const { contacts, loading } = this.state
        const { lan } = this.props

        if (loading) {
            return <Loading />
        }

        return (
            <DashboardTemplate>
                <div className="page-content">
                    <nav className="page-breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a className="a-whitebg" href="#">{LOCALES[lan]['web_wallet']['contacts']}</a></li>
                            <li className="breadcrumb-item active" aria-current="page">{LOCALES[lan]['web_wallet']['all']}</li>
                        </ol>
                    </nav>

                    <div className="row mt-4">
                        <div className="col-md-12 grid-margin stretch-card">
                            <div className="card">
                                <div className="card-body">
                                    <h6 className="card-title">{LOCALES[lan]['web_wallet']['contacts']}</h6>
                                    <div style={{ marginBottom: '10px' }}>
                                        <ReactHTMLTableToExcel
                                            className="btn btn-light mb-1 "
                                            table="contactsTable"
                                            filename="contacts"
                                            sheet="contacts"
                                            buttonText="Excel"
                                        />
                                        <div style={{ float: "right", display: 'flex' }}>                                            
                                            <button onClick={this.handleAddContact} type="button" className="btn btn-primary btn-icon-text mb-2 mb-md-0"><PlusCircle size="16" />{LOCALES[lan]['web_wallet']['add_contact']}</button>
                                        </div>
                                    </div>
                                    <div className="table-responsive">
                                        <table className="table table-hover" id="contactsTable">
                                            <thead>
                                                <tr>
                                                    <td>ID</td>
                                                    <td>{LOCALES[lan]['web_wallet']['name']}</td>
                                                    <td>{LOCALES[lan]['web_wallet']['username']}</td>
                                                    <td>{LOCALES[lan]['web_wallet']['email']}</td>                                                    
                                                    <td>{LOCALES[lan]['web_wallet']['action']}</td>
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


function mapStateToProps({ auth, language }) {
    return {
        token: auth && auth.token,
        lan: language ? language : 'en'
    }
}
export default connect(mapStateToProps)(Contacts)
