import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Link } from "react-router-dom";
import { Send, Download, Inbox, RefreshCw, Upload, Menu, User, LogOut } from 'react-feather';

// Actions
import { saveLanguage } from '../actions/language'
import { showSidebar, hideSidebar } from '../actions/shared'
import { logout } from '../actions/auth'

// Libraries
import ReactFlagsSelect from 'react-flags-select';
import 'react-flags-select/css/react-flags-select.css';

// Locales
import en from '../locales/en'
import fr from '../locales/fr'
import nl from '../locales/nl'
import es from '../locales/es'
import pt from '../locales/pt'
import ja from '../locales/ja'
import zh from '../locales/zh'
const LOCALES = { en, fr, nl, es, pt, ja, zh }
import moment from 'moment';


class Navbar extends Component {

    handleNavbarToggleBtn = (e) => {
        e.preventDefault()
        const { sidebar, dispatch } = this.props
        if (sidebar === false) {
            document.body.className += ' ' + 'sidebar-open'
            dispatch(showSidebar())
        } else {
            document.body.className = document.body.className.replace('sidebar-open', '')
            dispatch(hideSidebar())
        }
    }

    handleLanSelect = (country) => {
        const { dispatch } = this.props
        let lan = 'en'
        switch (country) {
            case 'GB':
                lan = 'en'
                break
            case 'FR':
                lan = 'fr'
                break
            case 'NL':
                lan = 'nl'
                break
            case 'ES':
                lan = 'es'
                break
            case 'PT':
                lan = 'pt'
                break
            case 'JP':
                lan = 'ja'
                break
            case 'CN':
                lan = 'zh'
                break
            default:
                lan = 'en'
                break
        }

        dispatch(saveLanguage(lan))
    }

    handleLogout = (e) => {
        e.preventDefault()
        const { dispatch } = this.props
        dispatch(logout())
        // window.location.href = `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/logout?redirect_uri=${process.env.SERVER_HOST}login`
    }

    render() {

        const { user, inbox, lan } = this.props

        if(!inbox) {
            return
        }

        let flag = 'GB'
        switch (lan) {
            case 'en':
                flag = 'GB'; break;
            case 'fr':
                flag = 'FR'; break;
            case 'nl':
                flag = 'NL'; break;
            case 'es':
                flag = 'ES'; break;
            case 'pt':
                flag = 'PT'; break;
            case 'ja':
                flag = 'JP'; break;
            case 'zh':
                flag = 'CH'; break;
        }

        return (

            < nav className="navbar" style={{backgroundColor:'#0033cc'}}>
                <a onClick={this.handleNavbarToggleBtn} href="#" className="sidebar-toggler">
                    <Menu size={16} />
                </a>
                <div className="navbar-content">
                    <div style={{ display: 'flex', }}>

                        <Link style={{ display: 'flex', marginLeft: '20px', }} to="/send">
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Send size="22" />
                                <div style={{ padding: '5px', fontSize: '18px', fontWeight: 'normal' }}>{LOCALES[lan]['web_wallet']['send']}</div>
                            </div>
                        </Link>
                        <div style={{ display: 'flex', alignItems: 'center', marginLeft: '20px', color: '#d6d6d6' }}>|</div>
                        <Link style={{ display: 'flex' }} to="/receive">
                            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '20px' }}>
                                <Download size="22" />
                                <div style={{ padding: '5px', fontSize: '18px', fontWeight: 'normal' }}>{LOCALES[lan]['web_wallet']['receive']}</div>
                            </div>
                        </Link>
                        <div style={{ display: 'flex', alignItems: 'center', marginLeft: '20px', color: '#d6d6d6' }}>|</div>
                        <Link style={{ display: 'flex' }} to="/withdraw">
                            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '20px' }}>
                                <Upload size="22" />
                                <div style={{ padding: '5px', fontSize: '18px', fontWeight: 'normal' }}>{LOCALES[lan]['web_wallet']['withdraw']}</div>
                            </div>
                        </Link>
                    </div>
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <ReactFlagsSelect
                                countries={["GB", "FR", "NL", "ES", "PT", "JP", "CN"]}
                                defaultCountry={flag}
                                placeholder="Select Language"
                                showSelectedLabel={false}
                                showOptionLabel={false}
                                selectedSize={14}
                                optionsSize={14}
                                className="languageSelector"
                                onSelect={this.handleLanSelect}
                            />
                        </li>
                        {/* <li className="nav-item dropdown nav-notifications">
                            <a className="nav-link dropdown-toggle" href="#" id="notificationDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <RefreshCw />
                            </a>
                        </li> */}

                        <li className="nav-item dropdown nav-messages">
                            <a className="nav-link dropdown-toggle" href="#" id="messageDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <Inbox size="24" />
                            </a>
                            <div className="dropdown-menu" aria-labelledby="messageDropdown">
                                <div className="dropdown-header d-flex align-items-center justify-content-between">
                                    <p className="mb-0 font-weight-medium">{Object.values(inbox).length} Pending Txs</p>

                                </div>
                                <div className="dropdown-body">
                                    {
                                        inbox && Object.values(inbox).length > 0
                                            ?
                                            Object.values(inbox).map((tx) => (
                                                <Link to={'/inboxTx/' + tx.id} key={tx.id} href="#" className="dropdown-item">
                                                    <div className="content">
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <p style={{color: 'black'}}>{tx.user.firstName + ' ' + tx.user.lastName}</p>
                                                            <p className="sub-text text-muted">{moment(tx.createdAt).fromNow()}</p>
                                                        </div>
                                                        <p className="sub-text text-muted">{tx.reason}</p>
                                                    </div>
                                                </Link>
                                            ))
                                            :
                                            <a href="#" className="dropdown-item">
                                                <div style={{ marginLeft: '0px' }} className="content">
                                                    <div className="d-flex justify-content-between align-items-center">
                                                        <p style={{color: 'black'}}>No pending transactions</p>
                                                    </div>
                                                </div>
                                            </a>
                                    }

                                </div>
                                <div className="dropdown-footer d-flex align-items-center justify-content-center">
                                    <Link className="a-whitebg" to="/inbox">View all</Link>
                                </div>
                            </div>
                        </li>

                        <li className="nav-item dropdown nav-profile">
                            <a className="nav-link dropdown-toggle" href="#" id="profileDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <img src={process.env.SERVER_HOST + 'images/defaultUser.png'} />
                            </a>
                            <div className="dropdown-menu" aria-labelledby="profileDropdown">
                                <div className="dropdown-header d-flex flex-column align-items-center">
                                    <div className="figure mb-3">
                                        <img src={process.env.SERVER_HOST + 'images/defaultUserBlack.png'} />
                                    </div>
                                    <div className="info text-center">
                                        <p className="name font-weight-bold mb-0">{user.firstName + ' ' + user.lastName}</p>
                                        <p className="email text-muted mb-3">{user.email}</p>
                                    </div>
                                </div>
                                <div className="dropdown-body">
                                    <ul className="profile-nav p-0 pt-3">
                                        <li className="nav-item">
                                            <Link to="/profile" className="nav-link" className="a-whitebg">
                                                <User />
                                                <span style={{marginLeft: '10px'}}>{LOCALES[lan]['web_wallet']['profile']}</span>
                                            </Link>
                                        </li>
                                        <li className="nav-item">
                                            <a onClick={this.handleLogout} href="#" className="nav-link" className="a-whitebg">
                                                <LogOut />
                                                <span style={{marginLeft: '10px'}}>{LOCALES[lan]['web_wallet']['logout']}</span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </nav >

        )
    }
}

function mapStateToProps({ auth, user, inbox, sidebar, language }) {
    return {
        token: auth && auth.token,
        user,
        inbox,
        sidebar,
        lan: language ? language : 'en'
    }
}
export default connect(mapStateToProps)(Navbar)
