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

// Locales
import en from '../locales/en'
import fr from '../locales/fr'
import nl from '../locales/nl'
import es from '../locales/es'
import pt from '../locales/pt'
import ja from '../locales/ja'
import zh from '../locales/zh'
const LOCALES = { en, fr, nl, es, pt, ja, zh }

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

        const { token, lan } = this.props
        const { address, amount } = this.state

        if (!address || !amount) {
            this.setState({ serverStatus: 'ERROR', serverMsg: LOCALES[lan]['error']['missing_required'] })
            return
        }

        if (isNaN(amount) || amount < 0) {
            this.setState({ serverStatus: 'ERROR', serverMsg: LOCALES[lan]['error']['enter_valid_amount'] })
            return
        }        

        confirmAlert({
            title: LOCALES[lan]['web_wallet']['withdraw_confirmation_title'],
            message: LOCALES[lan]['web_wallet']['withdraw_confirmation_msg'] + this.state.amount + ' JWS ?',
            buttons: [
                {
                    label: LOCALES[lan]['web_wallet']['yes'],
                    onClick: () => {
                        withdrawTokens({ toAddress: address, amount, token })
                            .then(data => data.json())
                            .then((res) => {
                                console.log(res)
                                if (res.status === 'OK') {
                                    console.log(res.payload)
                                    this.setState({ serverStatus: 'OK', serverMsg: LOCALES[lan]['web_wallet']['tx_sent'], amount: '', address: '' })
                                } else {
                                    this.setState({ serverStatus: 'ERROR', serverMsg: res.message })
                                }
                            })
                            .catch((err) => {
                                console.log(err)
                                this.setState({ serverStatus: 'ERROR', serverMsg: LOCALES[lan]['error']['general'] })
                                return
                            })                       
                    }
                },
                {
                    label: LOCALES[lan]['web_wallet']['penorson'],
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
        const { lan } = this.props        

        return (
            <DashboardTemplate>
                <div className="page-content">
                    <nav className="page-breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="#">{LOCALES[lan]['web_wallet']['withdraw']}</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Jiwards</li>
                        </ol>
                    </nav>

                    <div className="row mt-4">
                        <div className="col-md-6 col-xs-12 col-sm-12 grid-margin stretch-card">
                            <div className="card">
                                <div className="card-body">
                                    <div className="card-body">
                                        <h6 className="card-title">{LOCALES[lan]['web_wallet']['withdraw']} JWS</h6>
                                        <form className="forms-sample">
                                            {
                                                serverMsg
                                                &&
                                                <div className={serverStatus === 'OK' ? "alert alert-success" : "alert alert-danger"} role="alert">
                                                    {serverMsg}
                                                </div>
                                            }

                                            <div className="form-group">
                                                <label >ETH {LOCALES[lan]['web_wallet']['address']}</label>
                                                <input onChange={this.handleAddressChange} value={this.state.address} type="text" className="form-control" placeholder="Enter an external ETH Address" />
                                            </div>

                                            <div className="form-group">
                                                <label >{LOCALES[lan]['web_wallet']['amount']}</label>
                                                <input onChange={this.handleAmountChange} value={this.state.amount} type="number" className="form-control" autoComplete="off" placeholder="Enter the amount to transfer" />
                                            </div>

                                            <button onClick={this.handleConfirmTx} className="btn btn-primary mr-2">{LOCALES[lan]['web_wallet']['withdraw']}</button>
                                            <button onClick={this.handleGoBack} className="btn btn-light">{LOCALES[lan]['web_wallet']['cancel']}</button>
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


function mapStateToProps({ auth, language }) {
    return {
        token: auth && auth.token,
        lan: language ? language : 'en'
    }
}
export default connect(mapStateToProps)(Withdraw)
