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
        const { user, lan } = this.props

        if (loading) {
            return <Loading />
        }

        return (
            <DashboardTemplate>
                <div className="page-content">
                    <nav className="page-breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="#">{LOCALES[lan]['web_wallet']['transactions']}</a></li>
                            <li className="breadcrumb-item active" aria-current="page">{selectedOperation}</li>
                        </ol>
                    </nav>

                    <div className="row mt-4">
                        <div className="col-md-12 grid-margin stretch-card">
                            <div className="card">
                                <div className="card-body">
                                    <h6 className="card-title">{LOCALES[lan]['web_wallet']['transactions']}</h6>
                                    <div style={{ marginBottom: '10px' }}>
                                        <button onClick={e => { e.preventDefault(); this.handleOperationSelect('All') }} className={selectedOperation === 'All' ? "btn btn-primary mb-1" : "btn btn-light mb-1"} style={{ marginRight: '5px' }}>{LOCALES[lan]['web_wallet']['all']}</button>
                                        <button onClick={e => { e.preventDefault(); this.handleOperationSelect('Sent') }} className={selectedOperation === 'Sent' ? "btn btn-primary mb-1" : "btn btn-light mb-1"} style={{ marginRight: '5px' }}>{LOCALES[lan]['web_wallet']['sent']}</button>
                                        <button onClick={e => { e.preventDefault(); this.handleOperationSelect('Received') }} className={selectedOperation === 'Received' ? "btn btn-primary mb-1" : "btn btn-light mb-1"}>{LOCALES[lan]['web_wallet']['received']}</button>

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
                                                        txs.filter((tx) => {
                                                            let operation = tx.userId === user.id ? LOCALES[lan]['web_wallet']['sent'] : LOCALES[lan]['web_wallet']['received']
                                                            if (selectedOperation != operation && selectedOperation != 'All') {
                                                                return false
                                                            }
                                                            return true
                                                        })

                                                            .map((tx, index) => (
                                                                <tr key={index}>
                                                                    <td>{index + 1}</td>
                                                                    <td>{tx.userId === user.id ? tx.to.firstName + ' ' + tx.to.lastName : tx.from.firstName + ' ' + tx.from.lastName}</td>
                                                                    <td>{tx.userId === user.id ? LOCALES[lan]['web_wallet']['sent'] : LOCALES[lan]['web_wallet']['received']}</td>
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


function mapStateToProps({ auth, user, language }) {
    return {
        token: auth && auth.token,
        user,
        lan: language ? language : 'en'
    }
}
export default connect(mapStateToProps)(Transactions)
