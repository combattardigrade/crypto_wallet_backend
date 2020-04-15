import React, { Component } from 'react'
import { connect } from 'react-redux'


// Components
import DashboardTemplate from './DashboardTemplate'
import Loading from './Loading'

// API
import { withdrawTokens } from '../utils/api'

// Libraries
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css


class Withdraw extends Component {

    state = {
        address: '',
        amount: '',
        serverStatus: '',
        serverMsg: '',
        loading: true
    }



    handleAddressChange = (e) => {
        this.setState({ address: e.target.value })
    }

    handleAmountChange = (e) => {
        this.setState({ amount: e.target.value })
    }



    handleConfirmTx = (e) => {
        e.preventDefault()

        const { token } = this.props
        const { address, amount } = this.state

        if (!address || !amount) {
            this.setState({ serverStatus: 'ERROR', serverMsg: 'Enter all the required fields' })
            return
        }

        if (isNaN(amount) || amount < 0) {
            this.setState({ serverStatus: 'ERROR', serverMsg: 'Enter a valid amount' })
            return
        }        

        confirmAlert({
            title: 'Withdraw Confirmation',
            message: 'Are you sure you want to withdraw ' + this.state.amount + ' JWS ?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        withdrawTokens({ toAddress: address, amount, token })
                            .then(data => data.json())
                            .then((res) => {
                                console.log(res)
                                if (res.status === 'OK') {
                                    console.log(res.payload)
                                    this.setState({ serverStatus: 'OK', serverMsg: 'Transaction sent!', amount: '', address: '' })
                                } else {
                                    this.setState({ serverStatus: 'ERROR', serverMsg: res.message })
                                }
                            })
                            .catch((err) => {
                                console.log(err)
                                this.setState({ serverStatus: 'ERROR', serverMsg: 'An error occurred. Please try again!' })
                                return
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

    handleGoBack = (e) => {
        e.preventDefault()
        this.props.history.goBack()
    }


    render() {
        const { serverStatus, serverMsg, loading } = this.state

        

        return (
            <DashboardTemplate>
                <div className="page-content">
                    <nav className="page-breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="#">Withdraw</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Jiwards</li>
                        </ol>
                    </nav>

                    <div className="row mt-4">
                        <div className="col-md-6 col-xs-12 col-sm-12 grid-margin stretch-card">
                            <div className="card">
                                <div className="card-body">
                                    <div className="card-body">
                                        <h6 className="card-title">Withdraw JWS</h6>
                                        <form className="forms-sample">
                                            {
                                                serverMsg
                                                &&
                                                <div className={serverStatus === 'OK' ? "alert alert-success" : "alert alert-danger"} role="alert">
                                                    {serverMsg}
                                                </div>
                                            }

                                            <div className="form-group">
                                                <label >ETH Address</label>
                                                <input onChange={this.handleAddressChange} value={this.state.address} type="text" className="form-control" placeholder="Enter an external ETH Address" />
                                            </div>

                                            <div className="form-group">
                                                <label >Amount</label>
                                                <input onChange={this.handleAmountChange} value={this.state.amount} type="number" className="form-control" autoComplete="off" placeholder="Enter the amount to transfer" />
                                            </div>

                                            <button onClick={this.handleConfirmTx} className="btn btn-primary mr-2">Withdraw</button>
                                            <button onClick={this.handleGoBack} className="btn btn-light">Cancel</button>
                                        </form>
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
export default connect(mapStateToProps)(Withdraw)
