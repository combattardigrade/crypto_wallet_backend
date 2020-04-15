import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Link } from "react-router-dom";
// Components
import DashboardTemplate from './DashboardTemplate'

// Components
import Loading from './Loading'

// API
import { getTxs } from '../utils/api'

// Libraries
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
const moment = require('moment')

class TxDetails extends Component {

    state = {
        tx: '',
        loading: true
    }

    componentDidMount() {
        const { token } = this.props
        const { txId } = this.props.match.params
        getTxs({ token })
            .then(data => data.json())
            .then((res) => {
                if (res.status === 'OK') {
                    console.log(res.payload)                    
                    this.setState({ loading: false, tx: (res.payload.filter(tx => tx.id == txId))[0]})
                    
                }
            })
    }
  

    render() {
        const { tx, loading } = this.state

        if (loading) {
            return <Loading />
        }

        return (
            <DashboardTemplate>
                <div className="page-content">
                    <nav className="page-breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="#">Transactions</a></li>
                            <li className="breadcrumb-item active" aria-current="page">{tx.id}</li>
                        </ol>
                    </nav>

                    <div className="row mt-4">
                        <div className="col-md-6 col-xs-12 col-sm-12 grid-margin stretch-card">
                            <div className="card">
                                <div className="card-body">
                                    <div className="card-body">
                                        <h6 className="card-title">Transaction Details</h6>
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
                                                        <td>From User (ID)</td>
                                                        <td>{tx.from.id}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>From User (Name)</td>
                                                        <td>{tx.from.firstName + ' ' + tx.from.lastName}</td>
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
export default connect(mapStateToProps)(TxDetails)
