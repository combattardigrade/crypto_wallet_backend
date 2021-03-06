import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Link } from "react-router-dom";
// Components
import DashboardTemplate from './DashboardTemplate'
import ReactLoading from 'react-loading';

// Components
import Loading from './Loading'

// API
import { getInbox, approvePaymentRequest, getRequestsSent } from '../utils/api'

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

const moment = require('moment')



class InboxHistory extends Component {

    state = {
        txs: '',
        requestsSent: '',
        serverStatus: '',
        serverMsg: '',
        loading: true
    }

    componentDidMount() {
        const { token, lan } = this.props
        document.title = `${LOCALES[lan]['web_wallet']['inbox']} | Jiwards`

        getInbox({ token })
            .then(data => data.json())
            .then((res) => {
                if (res.status === 'OK') {
                    console.log(res.payload)
                    this.setState({ loading: false, txs: res.payload })
                }
            })

        getRequestsSent({ token })
            .then(data => data.json())
            .then((res) => {
                if (res.status === 'OK') {
                    console.log(res.payload)
                    this.setState({ loading: false, requestsSent: res.payload })
                }
            })
    }

    handleApproveTx = (txId) => {
        const { token } = this.props


        confirmAlert({
            title: 'Confirmation',
            message: 'Are you sure you want to approve this transaction?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        approvePaymentRequest({ requestId: txId, token })
                            .then(data => data.json())
                            .then((res) => {
                                if (res.status === 'OK') {
                                    this.setState({
                                        contacts: contacts.filter(c => c.id !== contactId)
                                    })
                                } else {

                                }
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
        const { requestsSent, txs, loading } = this.state
        const { user, lan } = this.props

        if (loading) {
            return <Loading />
        }

        return (
            <DashboardTemplate>
                <div className="page-content">
                    <nav className="page-breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a className="a-whitebg" href="#">{LOCALES[lan]['web_wallet']['inbox']}</a></li>
                            <li className="breadcrumb-item active" aria-current="page">{LOCALES[lan]['web_wallet']['pending_approval']}</li>
                        </ol>
                    </nav>

                    <div className="row mt-4">
                        <div className="col-md-12 grid-margin stretch-card">
                            <div className="card">
                                <div className="card-body">
                                    <h6 className="card-title">{LOCALES[lan]['web_wallet']['payment_requests_send']}</h6>
                                    <div style={{ marginBottom: '10px' }}>

                                        <div style={{ float: 'right' }}>
                                            <ReactHTMLTableToExcel
                                                className="btn btn-light mb-1 "
                                                table="requestsTable"
                                                filename="payment_requests_sent"
                                                sheet="inbox"
                                                buttonText="Excel"
                                            />
                                        </div>

                                    </div>
                                    <div className="table-responsive">
                                        <table className="table table-hover" id="requestsTable">
                                            <thead>
                                                <tr>
                                                    <td>ID</td>
                                                    <td>{LOCALES[lan]['web_wallet']['person']}</td>
                                                    <td>{LOCALES[lan]['web_wallet']['operation']}</td>
                                                    <td>{LOCALES[lan]['web_wallet']['amount']}</td>
                                                    <td>{LOCALES[lan]['web_wallet']['currency']}</td>
                                                    <td>{LOCALES[lan]['web_wallet']['reason']}</td>
                                                    <td>{LOCALES[lan]['web_wallet']['description']}</td>
                                                    <td>{LOCALES[lan]['web_wallet']['status']}</td>
                                                    <td>{LOCALES[lan]['web_wallet']['date']}</td>
                                                    <td>{LOCALES[lan]['web_wallet']['details']}</td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    requestsSent && requestsSent.length > 0
                                                        ?
                                                        requestsSent.map((tx, index) => (
                                                            tx.status === 'PENDING_APPROVAL' &&
                                                            <tr key={index}>
                                                                <td>{tx.id}</td>
                                                                <td>{tx.receiver.firstName + ' ' + tx.receiver.lastName}</td>
                                                                <td>{LOCALES[lan]['web_wallet']['payment_request']}</td>
                                                                <td>{parseFloat(tx.amount)}</td>
                                                                <td>{tx.currency}</td>
                                                                <td>{tx.reason}</td>
                                                                <td>{tx.description}</td>
                                                                <td>{tx.status}</td>
                                                                <td>{moment(tx.createdAt).format('DD/MM/YYY HH:mm')}</td>
                                                                <td>
                                                                    <Link to={'/paymentRequest/' + tx.id} className="btn btn-primary mb-1 mb-md-0 action-btn"><i className="fa fa-search btn-icon"></i></Link>
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
                                                            <td>-</td>
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


function mapStateToProps({ auth, user, language }) {
    return {
        token: auth && auth.token,
        user,
        lan: language ? language : 'en'
    }
}
export default connect(mapStateToProps)(InboxHistory)
