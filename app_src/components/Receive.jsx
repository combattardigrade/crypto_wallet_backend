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
import { CopyToClipboard } from 'react-copy-to-clipboard';

// Locales
import en from '../locales/en'
import fr from '../locales/fr'
import nl from '../locales/nl'
import es from '../locales/es'
import pt from '../locales/pt'
import ja from '../locales/ja'
import zh from '../locales/zh'
const LOCALES = { en, fr, nl, es, pt, ja, zh }

const QRCode = require('qrcode.react');

class Receive extends Component {


    handleGoBack = (e) => {
        e.preventDefault()
        this.props.history.goBack()
    }

    render() {

        const { user, lan } = this.props

        if (!user) {
            return <Loading />
        }

        return (
            <DashboardTemplate>
                <div className="page-content">
                    <nav className="page-breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="#">{LOCALES[lan]['web_wallet']['receive']}</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Jiwards</li>
                        </ol>
                    </nav>

                    <div className="row mt-4">
                        <div className="col-md-6 col-xs-12 col-sm-12 grid-margin stretch-card">
                            <div className="card">
                                <div className="card-body">
                                    <div className="card-body">
                                        <h6 className="card-title">{LOCALES[lan]['web_wallet']['receive']} JWS</h6>
                                        <form className="forms-sample">
                                            <div className="form-group" style={{ textAlign: 'center' }}>
                                                <QRCode style={{ width: '200px', height: '200px' }} value={user.userAddress.address} />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="exampleInputUsername1">ETH {LOCALES[lan]['web_wallet']['address']}</label>
                                                <input readOnly value={user.userAddress.address} type="text" className="form-control" autoComplete="off" />
                                            </div>
                                            <CopyToClipboard text={user.userAddress.address}
                                                onCopy={() => this.setState({ copied: true })}>
                                                <button onClick={e => {e.preventDefault()}} className="btn btn-primary mr-2">{LOCALES[lan]['web_wallet']['copy_address']}</button>
                                            </CopyToClipboard>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </DashboardTemplate >
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
export default connect(mapStateToProps)(Receive)
