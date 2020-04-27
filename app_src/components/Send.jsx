import React, { Component } from 'react'
import { connect } from 'react-redux'


// Components
import DashboardTemplate from './DashboardTemplate'
import Loading from './Loading'

// API
import { getTxReasons, getContacts, sendInternalTx } from '../utils/api'

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

class Send extends Component {

    state = {
        sendTo: '',
        amount: '',
        reason: '',
        description: '',
        contacts: '',
        txReasons: '',
        selectedContact: '',
        selectedReason: '',
        serverStatus: '',
        serverMsg: '',
        loading: true
    }

    componentDidMount() {
        const { token } = this.props

        getTxReasons({ token })
            .then(data => data.json())
            .then((res) => {
                if (res.status === 'OK') {
                    console.log(res.payload)
                    this.setState({ loading: false, txReasons: res.payload })
                }
            })
        getContacts({ token })
            .then(data => data.json())
            .then((res) => {
                if (res.status === 'OK')
                    console.log(res.payload)
                this.setState({ loading: false, contacts: res.payload })
            })
    }

    handleContactChange = (e) => {
        this.setState({ selectedContact: e.target.value })
    }

    handleAmountChange = (e) => {
        this.setState({ amount: e.target.value })
    }

    handleReasonChange = (e) => {
        this.setState({ selectedReason: e.target.value })
    }

    handleDescription = (e) => {
        this.setState({ description: e.target.value })
    }

    handleConfirmTx = (e) => {
        e.preventDefault()

        const { token } = this.props
        const { selectedContact, amount, selectedReason, description } = this.state

        if (!selectedContact || !amount || !selectedReason || !description) {
            this.setState({ serverStatus: 'ERROR', serverMsg: 'Enter all the required fields' })
            return
        }

        if (isNaN(amount) || amount < 0) {
            this.setState({ serverStatus: 'ERROR', serverMsg: 'Enter a valid amount' })
            return
        }

        const params = {
            toUserId: selectedContact,
            amount: amount,
            currency: 'JWS',
            reason: selectedReason,
            description: description,
            token
        }

        confirmAlert({
            title: 'Transfer Confirmation',
            message: 'Are you sure you want to transfer ' + this.state.amount + ' JWS ?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        sendInternalTx(params)
                            .then(data => data.json())
                            .then((res) => {
                                if (res.status === 'OK') {
                                    console.log(res.payload)
                                    this.setState({ serverStatus: 'OK', serverMsg: 'Transaction sent!', amount: '', description: '' })
                                } else {
                                    this.setState({ serverStatus: 'ERROR', serverMsg: res.message })
                                }
                            })
                            .catch((err) => {
                                console.log(err)
                                this.setState({ serverStatus: 'ERROR', serverMsg: 'An error occurred. Please try again!' })
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
        const { contacts, txReasons, serverStatus, serverMsg, loading } = this.state
        const { lan } = this.props

        if (loading) {
            return <Loading />
        }

        return (
            <DashboardTemplate>
                <div className="page-content">
                    <nav className="page-breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="#">{LOCALES[lan]['web_wallet']['send']}</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Jiwards</li>
                        </ol>
                    </nav>

                    <div className="row mt-4">
                        <div className="col-md-6 col-xs-12 col-sm-12 grid-margin stretch-card">
                            <div className="card">
                                <div className="card-body">
                                    <div className="card-body">
                                        <h6 className="card-title">{LOCALES[lan]['web_wallet']['send']} JWS</h6>
                                        <form className="forms-sample">
                                            {
                                                serverMsg
                                                &&
                                                <div className={serverStatus === 'OK' ? "alert alert-success" : "alert alert-danger"} role="alert">
                                                    {serverMsg}
                                                </div>
                                            }
                                            <div className="form-group">
                                                <label htmlFor="exampleInputPassword1">Send To</label>
                                                <select value={this.state.selectedContact} onChange={this.handleContactChange} className="js-example-basic-single w-100 select2-hidden-accessible" aria-hidden="true">
                                                    {
                                                        contacts &&
                                                        contacts.map((c, i) => (
                                                            <option key={i} value={c.id}>{c.firstName + ' ' + c.lastName}</option>
                                                        ))
                                                    }
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="exampleInputUsername1">{LOCALES[lan]['web_wallet']['amount']}</label>
                                                <input onChange={this.handleAmountChange} value={this.state.amount} type="number" className="form-control" autoComplete="off" placeholder="Amount" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="exampleInputPassword1">{LOCALES[lan]['web_wallet']['reason']}</label>
                                                <select value={this.state.selectedReason} onChange={this.handleReasonChange} className="js-example-basic-single w-100 select2-hidden-accessible" aria-hidden="true">
                                                    {
                                                        txReasons &&
                                                        txReasons.map((r, i) => (
                                                            <option key={i} value={r.reason}>{r.reason}</option>
                                                        ))
                                                    }
                                                </select>
                                            </div>

                                            <div className="form-group">
                                                <label htmlFor="exampleInputEmail1">{LOCALES[lan]['web_wallet']['description']}</label>
                                                <input onChange={this.handleDescription} value={this.state.description} type="text" className="form-control" placeholder="Description" />
                                            </div>

                                            <button onClick={this.handleConfirmTx} className="btn btn-primary mr-2">{LOCALES[lan]['web_wallet']['confirm_transfer']}</button>
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
export default connect(mapStateToProps)(Send)
