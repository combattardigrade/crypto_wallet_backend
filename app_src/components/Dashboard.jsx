import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Link } from "react-router-dom";

// Components
import DashboardTemplate from './DashboardTemplate'
import Loading from './Loading'

// API
import { getUserData, getInbox, getTxs } from '../utils/api'

// Actions
import { saveUserData } from '../actions/user'

// Locales
import en from '../locales/en'
import fr from '../locales/fr'
import nl from '../locales/nl'
import es from '../locales/es'
import pt from '../locales/pt'
import ja from '../locales/ja'
import zh from '../locales/zh'
const LOCALES = { en, fr, nl, es, pt, ja, zh }

// Libraries
const moment = require('moment')

class Dashboard extends Component {

    state = {
        loading: true,
        inbox: '',
        txs: '',
    }

    componentDidMount() {
        const { token, dispatch } = this.props

        getUserData({ token })
            .then(data => data.json())
            .then((res) => {
                if (res.status === 'OK') {
                    dispatch(saveUserData(res.payload))
                }
            })

        getInbox({ token })
            .then(data => data.json())
            .then((res) => {
                if (res.status === 'OK') {
                    console.log(res.payload)
                    this.setState({ loading: false, inbox: res.payload })
                }
            })

        getTxs({ token })
            .then(data => data.json())
            .then((res) => {
                if (res.status === 'OK') {
                    console.log(res.payload)
                    this.setState({ loading: false, txs: res.payload })
                }
            })
    }

    render() {
        const { loading, inbox, txs } = this.state
        const { user, lan } = this.props

        if (loading) {
            return <Loading />
        }

        return (
            <DashboardTemplate>

                <div className="page-content">
                    <div className="row">
                        <div className="col-md-4 grid-margin stretch-card">
                            <div className="card">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-xs-4 col-sm-4 col-md-6 col-xl-6">
                                            <h3>{LOCALES[lan]['web_wallet']['balance']}</h3>
                                            <h5>{parseFloat(user.balances[0].amount)} JWS</h5>
                                        </div>
                                        <div className="col-xs-8 col-sm-8 col-md-6 col-xl-6" style={{ textAlign: 'right' }}>
                                            <img style={{ height: '48px' }} src={process.env.SERVER_HOST + 'images/logo_icon.png'} alt="" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 grid-margin stretch-card">
                            <div className="card">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-xs-4 col-sm-4 col-md-6 col-xl-6">
                                            <h3>{LOCALES[lan]['web_wallet']['inbox']}</h3>
                                            <h5>{inbox.length} {LOCALES[lan]['web_wallet']['pending_approval']}</h5>
                                        </div>
                                        <div className="col-xs-8 col-sm-8 col-md-6 col-xl-6" style={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                            <i style={{ fontSize: '2em', color: '#0033cc' }} className="fa fa-inbox"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 grid-margin stretch-card">
                            <div className="card">
                                <div className="card-body">
                                    <div className="row">
                                        <div className="col-xs-4 col-sm-4 col-md-6 col-xl-6">
                                            <h3>{LOCALES[lan]['web_wallet']['transactions']}</h3>
                                            <h5>{txs && txs.length} Txs</h5>
                                        </div>
                                        <div className="col-xs-8 col-sm-8 col-md-6 col-xl-6" style={{ textAlign: 'right', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                                            <i style={{ fontSize: '2em', color: '#0033cc' }} className="fa fa-exchange"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">

                        <div className="col-xs-12 col-sm-12 col-md-6">
                            <div className="card">
                                <div className="card-body">
                                    <h6 className="card-title">{LOCALES[lan]['web_wallet']['inbox']}</h6>
                                    <div className="table-responsive">
                                        <table className="table table-hover" id="txsTable">
                                            <thead>
                                                <tr>
                                                    <td>#</td>
                                                    <td>{LOCALES[lan]['web_wallet']['person']}</td>
                                                    <td>{LOCALES[lan]['web_wallet']['operation']}</td>
                                                    <td>{LOCALES[lan]['web_wallet']['amount']}</td>
                                                    <td>{LOCALES[lan]['web_wallet']['reason']}</td>
                                                    <td>{LOCALES[lan]['web_wallet']['date']}</td>
                                                    <td>{LOCALES[lan]['web_wallet']['details']}</td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    txs && txs.length > 0
                                                        ?
                                                        txs.map((tx, index) => {
                                                            if (index < 10) {
                                                                return (
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
                                                                )
                                                            }
                                                        })
                                                        :
                                                        <tr>
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
                        <div className="col-xs-12 col-sm-12 col-md-6">
                            <div className="card">
                                <div className="card-body">
                                    <h6 className="card-title">{LOCALES[lan]['web_wallet']['transactions']}</h6>
                                    <div className="table-responsive">
                                        <table className="table table-hover" id="txsTable">
                                            <thead>
                                                <tr>
                                                    <td>ID</td>
                                                    <td>{LOCALES[lan]['web_wallet']['person']}</td>
                                                    <td>{LOCALES[lan]['web_wallet']['operation']}</td>
                                                    <td>{LOCALES[lan]['web_wallet']['amount']}</td>
                                                    <td>{LOCALES[lan]['web_wallet']['currency']}</td>
                                                    <td>{LOCALES[lan]['web_wallet']['reason']}</td>
                                                    <td>{LOCALES[lan]['web_wallet']['description']}</td>
                                                    <td>{LOCALES[lan]['web_wallet']['date']}</td>
                                                    <td>{LOCALES[lan]['web_wallet']['details']}</td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    inbox && inbox.length > 0
                                                        ?
                                                        inbox.map((tx, index) => {
                                                            if (index < 10) {
                                                                return (
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
                                                                )
                                                            }
                                                        })
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

export default connect(mapStateToProps)(Dashboard)
