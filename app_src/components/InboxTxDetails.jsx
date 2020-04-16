import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Link } from "react-router-dom";
// Components
import DashboardTemplate from './DashboardTemplate'

// Components
import Loading from './Loading'

// API
import { getInbox, approvePaymentRequest, rejectPaymentRequest } from '../utils/api'

// Libraries
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
const moment = require('moment')

class InboxTxDetails extends Component {

    state = {
        tx: '',
        serverStatus: '',
        serverMsg: '',
        loading: true
    }

    componentDidMount() {
        const { token } = this.props
        const { txId } = this.props.match.params

        getInbox({ token })
            .then(data => data.json())
            .then((res) => {
                if (res.status === 'OK') {
                    console.log(res.payload)
                    this.setState({ loading: false, tx: (res.payload.filter(tx => tx.id !== txId))[0] })
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
                                console.log()
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

        if (loading) {
            return <Loading />
        }

        return (
            <DashboardTemplate>
                <div className="page-content">
                    <nav className="page-breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="#">Pending Transaction</a></li>
                            <li className="breadcrumb-item active" aria-current="page">{tx.id}</li>
                        </ol>
                    </nav>

                    <div className="row mt-4">
                        <div className="col-md-6 col-xs-12 col-sm-12 grid-margin stretch-card">
                            <div className="card">
                                <div className="card-body">
                                    <div className="card-body">
                                        <h6 className="card-title">Pending Transaction Details</h6>
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
                                                        <td>Field</td>
                                                        <td>Value</td>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>TXID</td>
                                                        <td>{tx.id}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Send to User (ID)</td>
                                                        <td>{tx.user.id}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Send User (Name)</td>
                                                        <td>{tx.user.firstName + ' ' + tx.user.lastName}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Send User (Email)</td>
                                                        <td>{tx.user.email}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Amount</td>
                                                        <td>{parseFloat(tx.amount)}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Currency</td>
                                                        <td>{tx.currency}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Operation Type</td>
                                                        <td>{tx.operationType}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Reason</td>
                                                        <td>{tx.reason}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Description</td>
                                                        <td>{tx.description}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Status</td>
                                                        <td>{tx.status}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>Time</td>
                                                        <td>{moment().format('DD/MM/YY HH:mm')}</td>
                                                    </tr>

                                                </tbody>
                                            </table>
                                            {
                                                tx.status === 'PENDING_APPROVAL'
                                                &&
                                                <div style={{ marginTop: '20px' }}>
                                                    <button onClick={this.handleApprove} className="btn btn-primary mb-1 mb-md-0 action-btn"><i className="fa fa-check btn-icon"></i> Approve</button>
                                                    <button onClick={this.handleReject} className="btn btn-danger mb-1 mb-md-0 action-btn"><i className="fa fa-close btn-icon"></i> Reject</button>
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


function mapStateToProps({ auth }) {
    return {
        token: auth && auth.token,

    }
}
export default connect(mapStateToProps)(InboxTxDetails)
