import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from "react-router-dom";

// Components
import DashboardTemplate from './DashboardTemplate'
import Loading from './Loading'

// API
import { searchContact, addContact } from '../utils/api'

// Locales
import en from '../locales/en'
import fr from '../locales/fr'
import nl from '../locales/nl'
import es from '../locales/es'
import pt from '../locales/pt'
import ja from '../locales/ja'
import zh from '../locales/zh'
const LOCALES = { en, fr, nl, es, pt, ja, zh }

class AddContact extends Component {

    state = {
        contacts: '',
        searchValue: '',
        serverMsg: '',
        serverStatus: '',
        loading: false
    }

    handleSearchContact = (e) => {
        e.preventDefault()
        const { token } = this.props
        const searchValue = e.target.value
        this.setState({ searchValue })
        searchContact({ searchValue, token })
            .then(data => data.json())
            .then((res) => {
                console.log(res)
                this.setState({ contacts: res.payload })
            })
    }

    handleAddContact = (contactId) => {
        const { token } = this.props
        const { contacts } = this.state
        addContact({ contactId, token })
            .then(data => data.json())
            .then((res) => {
                console.log(res)
                this.setState({contacts: contacts.filter(c => c.id !== contactId)})
            })
    }

    handleGoBack = (e) => {
        e.preventDefault()
        this.props.history.goBack()
    }

    render() {
        const { serverMsg, serverStatus, loading, contacts } = this.state
        const { lan } = this.props

        if (loading) {
            return <Loading />
        }

        return (
            <DashboardTemplate>
                <div className="page-content">
                    <nav className="page-breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="#">{LOCALES[lan]['web_wallet']['contacts']}</a></li>
                            <li className="breadcrumb-item " aria-current="page">{LOCALES[lan]['web_wallet']['add']}</li>
                        </ol>
                    </nav>

                    <div className="row mt-4">
                        <div className="col-md-12 col-xs-12 col-sm-12 grid-margin stretch-card">
                            <div className="card">
                                <div className="card-body">
                                    <div className="card-body">
                                        <h6 className="card-title">{LOCALES[lan]['web_wallet']['add_contact']}</h6>
                                        <form className="forms-sample">
                                            {
                                                serverMsg
                                                &&
                                                <div className={serverStatus === 'OK' ? "alert alert-success" : "alert alert-danger"} role="alert">
                                                    {serverMsg}
                                                </div>
                                            }
                                            <div className="form-group">
                                                <label htmlFor="exampleInputUsername1">Search Contact</label>
                                                <input onChange={this.handleSearchContact} type="text" className="form-control" autoComplete="off" placeholder={LOCALES[lan]['web_wallet']['contacts_search_input']} value={this.state.searchValue} />
                                            </div>
                                        </form>
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
                                                                        <button onClick={e => { e.preventDefault(); this.handleAddContact(contact.id); }} className="btn btn-primary mb-1 mb-md-0 action-btn"><i className="fa fa-plus btn-icon"></i></button>
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
export default connect(mapStateToProps)(AddContact)
