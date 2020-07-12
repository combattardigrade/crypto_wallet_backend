import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Link } from "react-router-dom";
// Components
import DashboardTemplate from './DashboardTemplate'

// Components
import Loading from './Loading'

// API
import { getPaymentRequest, approvePaymentRequest, rejectPaymentRequest } from '../utils/api'

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

class InboxTxDetails extends Component {

    state = {
        tx: '',
        serverStatus: '',
        serverMsg: '',
        loading: true
    }

    componentDidMount() {
        const { token, lan } = this.props
        const { txId } = this.props.match.params
        document.title = `${LOCALES[lan]['web_wallet']['pending_tx']} | Jiwards`

        getPaymentRequest({ paymentRequestId: txId, token })
            .then(data => data.json())
            .then((res) => {
                if (res.status === 'OK') {
                    console.log(res.payload)
                    this.setState({ loading: false, tx: res.payload })
                }
            })
    }

    handleApprove = (e) => {
        e.preventDefault()
        const { tx } = this.state
        const { token, history } = this.props
        confirmAlert({
            title: 'Confirmation',
            message: 'Are you sure you want to approve this transaction?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        approvePaymentRequest({ requestId: tx.id, token })
                            .then(data => data.json())
                            .then((res) => {
                                if (res.status === 'OK') {
                                    this.setState({
                                        tx: {
                                            ...this.state.tx,
                                            status: 'APPROVED'
                                        },
                                        serverMsg: 'Transaction approved!',
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

    handleReject = (e) => {
        e.preventDefault()
        const { tx } = this.state
        const { token, history } = this.props
        confirmAlert({
            title: 'Confirmation',
            message: 'Are you sure you want to reject this transaction?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        rejectPaymentRequest({ requestId: tx.id, token })
                            .then(data => data.json())
                            .then((res) => {
                                console.log(res)
                                if (res.status === 'OK') {
                                    this.setState({
                                        tx: {
                                            ...this.state.tx,
                                            status: 'REJECTED'
                                        },
                                        serverMsg: 'Transaction rejected!',
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
        const { tx, serverMsg, serverStatus, loading } = this.state
        const { lan } = this.props

        if (loading) {
            return <Loading />
        }

        return (
            <DashboardTemplate>
                <div className="page-content">
                    <nav className="page-breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><Link className="a-whitebg" to={'/inbox'}>{LOCALES[lan]['web_wallet']['inbox']}</Link></li>
                            <li className="breadcrumb-item active" aria-current="page">{tx.id}</li>
                        </ol>
                    </nav>

                    <div className="row mt-4">
                        <div className="col-md-6 col-xs-12 col-sm-12 grid-margin stretch-card">
                            <div className="card">
                                <div className="card-body">
                                    <div className="card-body">
                                        <h6 className="card-title">{LOCALES[lan]['web_wallet']['pending_tx']} {LOCALES[lan]['web_wallet']['details']}</h6>
                                        {
                                            serverMsg
                                            &&
                                            <div className={serverStatus === 'OK' ? "alert alert-success" : "alert alert-danger"} role="alert">
                                                {serverMsg}
                                            </div>
                                        }
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
                                                        <td>{LOCALES[lan]['web_wallet']['send_to_user']} (ID)</td>
                                                        <td>{tx.user.id}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>{LOCALES[lan]['web_wallet']['send_to_user']} ({LOCALES[lan]['web_wallet']['name']})</td>
                                                        <td>{tx.user.firstName + ' ' + tx.user.lastName}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>{LOCALES[lan]['web_wallet']['send_to_user']} ({LOCALES[lan]['web_wallet']['email']})</td>
                                                        <td>{tx.user.email}</td>
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
                                                    <button onClick={this.handleApprove} className="btn btn-primary mb-1 mb-md-0 action-btn"><i className="fa fa-check btn-icon"></i> {LOCALES[lan]['web_wallet']['approve']}</button>
                                                    <button onClick={this.handleReject} className="btn btn-danger mb-1 mb-md-0 action-btn"><i className="fa fa-close btn-icon"></i> {LOCALES[lan]['web_wallet']['reject']}</button>
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
export default connect(mapStateToProps)(InboxTxDetails)
