import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Link } from "react-router-dom";
// Components
import DashboardTemplate from './DashboardTemplate'
import ReactLoading from 'react-loading';

// Components
import Loading from './Loading'

// API
import { getInbox, approvePaymentRequest } from '../utils/api'

// Libraries
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { PlusCircle } from 'react-feather';
const moment = require('moment')



class Inbox extends Component {

    state = {
        txs: '',
        serverStatus: '',
        serverMsg: '',
        loading: true
    }

    componentDidMount() {
        const { token } = this.props

        getInbox({ token })
            .then(data => data.json())
            .then((res) => {
                if (res.status === 'OK') {
                    console.log(res.payload)
                    this.setState({ loading: false, txs: res.payload })
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
                                if(res.status === 'OK') {
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
        const { txs, loading } = this.state
        const { user } = this.props

        if (loading) {
            return <Loading />
        }

        return (
            <DashboardTemplate>
                <div className="page-content">
                    <nav className="page-breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="#">Inbox</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Pending Approval</li>
                        </ol>
                    </nav>

                    <div className="row mt-4">
                        <div className="col-md-12 grid-margin stretch-card">
                            <div className="card">
                                <div className="card-body">
                                    <h6 className="card-title">Transactions Pending Approval</h6>
                                    <div style={{ marginBottom: '10px' }}>

                                        <div style={{ float: 'right' }}>
                                            <ReactHTMLTableToExcel
                                                className="btn btn-light mb-1 "
                                                table="inboxTable"
                                                filename="inbox"
                                                sheet="inbox"
                                                buttonText="Excel"
                                            />
                                        </div>

                                    </div>
                                    <div className="table-responsive">
                                        <table className="table table-hover" id="inboxTable">
                                            <thead>
                                                <tr>
                                                    <td>ID</td>
                                                    <td>Person</td>
                                                    <td>Operation</td>
                                                    <td>Amount</td>
                                                    <td>Currency</td>
                                                    <td>Reason</td>
                                                    <td>Description</td>
                                                    <td>Date</td>
                                                    <td>Details</td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    txs && txs.length > 0
                                                        ?
                                                        txs.map((tx, index) => (
                                                            <tr key={index}>
                                                                <td>{tx.id}</td>
                                                                <td>{tx.user.firstName + ' ' + tx.user.lastName}</td>
                                                                <td>Transfer</td>
                                                                <td>{parseFloat(tx.amount)}</td>
                                                                <td>{tx.currency}</td>
                                                                <td>{tx.reason}</td>
                                                                <td>{tx.description}</td>                                                                
                                                                <td>{moment(tx.createdAt).format('DD/MM/YYY HH:mm')}</td>
                                                                <td>
                                                                    <Link to={'/inboxTx/' + tx.id} className="btn btn-primary mb-1 mb-md-0 action-btn"><i className="fa fa-search btn-icon"></i></Link>
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


function mapStateToProps({ auth, user }) {
    return {
        token: auth && auth.token,
        user
    }
}
export default connect(mapStateToProps)(Inbox)
