import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Link } from "react-router-dom";
// Components
import DashboardTemplate from './DashboardTemplate'
import ReactLoading from 'react-loading';

// Components
import Loading from './Loading'

// API
import { getTxs } from '../utils/api'

// Libraries
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { PlusCircle } from 'react-feather';
const moment = require('moment')



class Transactions extends Component {

    state = {
        txs: '',
        selectedOperation: 'All',
        loading: true
    }

    componentDidMount() {
        const { token } = this.props

        getTxs({ token })
            .then(data => data.json())
            .then((res) => {
                if (res.status === 'OK') {
                    console.log(res.payload)
                    this.setState({ loading: false, txs: res.payload })
                }
            })
    }

    handleOperationSelect = (selectedOperation) => {
        const { token } = this.props
        getTxs({ token })
            .then(data => data.json())
            .then((res) => {
                if (res.status === 'OK') {
                    console.log(res.payload)
                    this.setState({ loading: false, txs: res.payload, selectedOperation })
                }
            })
    }

    render() {
        const { txs, selectedOperation, loading } = this.state
        const { user } = this.props

        if (loading) {
            return <Loading />
        }

        return (
            <DashboardTemplate>
                <div className="page-content">
                    <nav className="page-breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="#">Transactions</a></li>
                            <li className="breadcrumb-item active" aria-current="page">{selectedOperation}</li>
                        </ol>
                    </nav>

                    <div className="row mt-4">
                        <div className="col-md-12 grid-margin stretch-card">
                            <div className="card">
                                <div className="card-body">
                                    <h6 className="card-title">Transactions</h6>
                                    <div style={{ marginBottom: '10px' }}>
                                        <button onClick={e => { e.preventDefault(); this.handleOperationSelect('All') }} className={selectedOperation === 'All' ? "btn btn-primary mb-1" : "btn btn-light mb-1"} style={{ marginRight: '5px' }}>All</button>
                                        <button onClick={e => { e.preventDefault(); this.handleOperationSelect('Sent') }} className={selectedOperation === 'Sent' ? "btn btn-primary mb-1" : "btn btn-light mb-1"} style={{ marginRight: '5px' }}>Sent</button>
                                        <button onClick={e => { e.preventDefault(); this.handleOperationSelect('Received') }} className={selectedOperation === 'Received' ? "btn btn-primary mb-1" : "btn btn-light mb-1"}>Received</button>

                                        <div style={{ float: 'right' }}>
                                            <ReactHTMLTableToExcel
                                                className="btn btn-light mb-1 "
                                                table="txsTable"
                                                filename="transactions"
                                                sheet="transactions"
                                                buttonText="Excel"
                                            />
                                        </div>

                                    </div>
                                    <div className="table-responsive">
                                        <table className="table table-hover" id="txsTable">
                                            <thead>
                                                <tr>
                                                    <td>#</td>
                                                    <td>Person</td>
                                                    <td>Operation</td>
                                                    <td>Amount</td>
                                                    <td>Reason</td>
                                                    <td>Date</td>
                                                    <td>Details</td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    txs && txs.length > 0
                                                        ?
                                                        txs.filter((tx) => {
                                                            let operation = tx.userId === user.id ? 'Sent' : 'Received'
                                                            if (selectedOperation != operation && selectedOperation != 'All') {
                                                                return false
                                                            }
                                                            return true
                                                        })

                                                            .map((tx, index) => (
                                                                <tr key={index}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{tx.userId === user.id ? tx.to.firstName + ' ' + tx.to.lastName : tx.from.firstName + ' ' + tx.from.lastName}</td>
                                                                    <td>{tx.userId === user.id ? 'Sent' : 'Received'}</td>
                                                                    <td>{parseFloat(tx.amount)}</td>
                                                                    <td>{tx.reason}</td>
                                                                    <td>{moment(tx.createdAt).format('DD/MM/YYY HH:mm')}</td>
                                                                    <td>
                                                                    <Link to={`/tx/${tx.id}`} className="btn btn-primary mb-1 mb-md-0 action-btn"><i className="fa fa-search btn-icon"></i></Link>
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
export default connect(mapStateToProps)(Transactions)
