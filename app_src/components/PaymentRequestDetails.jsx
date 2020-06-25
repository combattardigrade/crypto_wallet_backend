import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Link } from "react-router-dom";
// Components
import DashboardTemplate from './DashboardTemplate'

// Components
import Loading from './Loading'

// API
import { getRequestsSent, cancelPaymentRequest } from '../utils/api'

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
const moment = require('moment')

class PaymentRequestDetails extends Component {

    state = {
        tx: '',
        loading: true
    }

    componentDidMount() {
        const { token, lan } = this.props
        const { txId } = this.props.match.params

        document.title = `${LOCALES[lan]['web_wallet']['payment_requests_send']} | Jiwards`

        getRequestsSent({ token })
            .then(data => data.json())
            .then((res) => {
                if (res.status === 'OK') {
                    console.log(res.payload)
                    this.setState({ loading: false, tx: (res.payload.filter(tx => tx.id == txId))[0] })

                }
            })
    }

    handleReject = (e) => {
        e.preventDefault()
        const { tx } = this.state
        const { token, history } = this.props
        confirmAlert({
            title: 'Confirmation',
            message: 'Are you sure you want to cancel this payment request?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        cancelPaymentRequest({ requestId: tx.id, token })
                            .then(data => data.json())
                            .then((res) => {
                                console.log(res)
                                if (res.status === 'OK') {
                                    this.setState({
                                        tx: {
                                            ...this.state.tx,
                                            status: 'CANCELED'
                                        },
                                        serverMsg: 'Payment request canceled!',
                                        serverStatus: 'OK'
                                    })
                                    history.goBack()
                                } else {
                                    this.setState({
                                        serverMsg: res.message,
                                        serverStatus: 'ERROR'
                                    })
                                }
                            })
                            .catch((err) => {
                                console.log(err)
                                this.setState({
                                    serverMsg: 'An error occurred. Please try again!',
                                    serverStatus: 'ERROR'
                                })
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
        const { tx, loading } = this.state
        const { lan } = this.props

        if (loading) {
            return <Loading />
        }

        return (
            <DashboardTemplate>
                <div className="page-content">
                    <nav className="page-breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link className="a-whitebg" to="/txs">{LOCALES[lan]['web_wallet']['payment_request']}</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">{tx.id}</li>
                        </ol>
                    </nav>

                    <div className="row mt-4">
                        <div className="col-md-6 col-xs-12 col-sm-12 grid-margin stretch-card">
                            <div className="card">
                                <div className="card-body">
                                    <div className="card-body">
                                        <h6 className="card-title">{LOCALES[lan]['web_wallet']['tx_details']}</h6>
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
                                                        <td>TXID</td>
                                                        <td>{tx.id}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>{LOCALES[lan]['web_wallet']['contact']} (ID)</td>
                                                        <td>{tx.receiver.id}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>{LOCALES[lan]['web_wallet']['contact']} ({LOCALES[lan]['web_wallet']['name']})</td>
                                                        <td>{tx.receiver.firstName + ' ' + tx.receiver.lastName}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>{LOCALES[lan]['web_wallet']['amount']}</td>
                                                        <td>{parseFloat(tx.amount)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>{LOCALES[lan]['web_wallet']['currency']}</td>
                                                        <td>{tx.currency}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>{LOCALES[lan]['web_wallet']['operation_type']}</td>
                                                        <td>{tx.operationType}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>{LOCALES[lan]['web_wallet']['reason']}</td>
                                                        <td>{tx.reason}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>{LOCALES[lan]['web_wallet']['description']}</td>
                                                        <td>{tx.description}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>{LOCALES[lan]['web_wallet']['status']}</td>
                                                        <td>{tx.status}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>{LOCALES[lan]['web_wallet']['date']}</td>
                                                        <td>{moment().format('DD/MM/YY HH:mm')}</td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                            {
                                                tx.status === 'PENDING_APPROVAL'
                                                &&
                                                <div style={{ marginTop: '20px' }}>
                                                    <button onClick={this.handleReject} className="btn btn-danger mb-1 mb-md-0 action-btn"><i className="fa fa-close btn-icon"></i> {LOCALES[lan]['web_wallet']['cancel']}</button>
                                                </div>
                                            }
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
export default connect(mapStateToProps)(PaymentRequestDetails)
