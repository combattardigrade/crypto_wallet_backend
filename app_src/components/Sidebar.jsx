import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Link } from "react-router-dom";
import { Box, Inbox, Users, Award, Repeat } from 'react-feather';

// Libraries
import { isBrowser, isMobile } from 'react-device-detect';
import onClickOutside from "react-onclickoutside";

// Actions
import { showSidebar, hideSidebar, resetSidebar } from '../actions/shared'

// Locales
import en from '../locales/en'
import fr from '../locales/fr'
import nl from '../locales/nl'
import es from '../locales/es'
import pt from '../locales/pt'
import ja from '../locales/ja'
import zh from '../locales/zh'
const LOCALES = { en, fr, nl, es, pt, ja, zh }

class Sidebar extends Component {

    componentDidMount() {
        const { dispatch } = this.props
        if (isBrowser) {
            dispatch(hideSidebar())
        } else if (isMobile) {
            dispatch(showSidebar())
        }
    }

    handleClickOutside = (e) => {
        const { sidebar, dispatch } = this.props
        if (isMobile && sidebar === true || window.innerWidth <= 990 && sidebar === true) {
            dispatch(hideSidebar())
        }
    }

    handleSidebarToggleBtn = (e) => {
        e.preventDefault()
        const { sidebar, dispatch } = this.props
        if (sidebar === false) {
            document.body.className += ' ' + 'sidebar-folded'
            dispatch(showSidebar())
        } else {
            document.body.className = document.body.className.replace('sidebar-folded', '')
            document.body.className = document.body.className.replace('sidebar-open', '')
            dispatch(hideSidebar())
        }
    }

    handleSidebarHover = (e) => {
        e.preventDefault()
        const { sidebar } = this.props
        sidebar ? document.body.className += ' ' + 'open-sidebar-folded' : null
    }

    handleSidebarBlur = (e) => {
        e.preventDefault()
        const { sidebar } = this.props
        sidebar ? document.body.className = document.body.className.replace('open-sidebar-folded', '') : null
    }

    render() {
        const { user, sidebar, lan } = this.props

        return (
            <Fragment>
                <nav className="sidebar">
                    <div className="sidebar-header">
                        <a href={`${process.env.WEB_HOST}dashboard`} className="sidebar-brand">
                            Jiwards<span style={{ color: '#144fff' }}> Wallet</span>
                        </a>
                        <div className={sidebar ? 'sidebar-toggler active' : 'sidebar-toggler not-active'} onClick={this.handleSidebarToggleBtn}>
                            <span />
                            <span />
                            <span />
                        </div>
                    </div>
                    <div style={{ overflowY: 'scroll', overflowX: 'hidden' }} className="sidebar-body" onMouseEnter={this.handleSidebarHover} onMouseLeave={this.handleSidebarBlur}>
                        <ul className="nav">
                            <li className="nav-item nav-category">{LOCALES[lan]['web_wallet']['total_balance']}</li>
                            <li className="nav-item">
                                <Link to={`/dashboard`} className="nav-link">
                                    <span style={{ marginLeft: '2px', fontSize: '1em' }} className="link-title">{parseFloat(user.balances[0].amount)} JWS</span>
                                </Link>
                            </li>

                            <li className="nav-item nav-category">Main</li>
                            <li className="nav-item">
                                <Link to={`/dashboard`} className="nav-link">
                                    <Box size="16" />
                                    <span style={{ marginLeft: '15px' }} className="link-title">{LOCALES[lan]['web_wallet']['dashboard']}</span>
                                </Link>
                            </li>
                           
                            <li className="nav-item">
                                <a className="nav-link" data-toggle="collapse" href="#rankings" role="button" aria-expanded="false" aria-controls="rankings">
                                    <Inbox size="16" />
                                    <span style={{ marginLeft: '15px' }} className="link-title">{LOCALES[lan]['web_wallet']['inbox']}</span>
                                    <i className="link-arrow" data-feather="chevron-down" />
                                </a>
                                <div className="collapse" id="rankings">
                                    <ul className="nav sub-menu">
                                        <li className="nav-item">
                                            <Link to="/inbox" className="nav-link">{LOCALES[lan]['web_wallet']['pending_approval']}</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link to="/inbox-history" className="nav-link">{LOCALES[lan]['web_wallet']['payment_requests_send']}</Link>
                                        </li>
                                    </ul>
                                </div>
                            </li>

                            <li className="nav-item nav-category">{LOCALES[lan]['web_wallet']['contacts']}</li>
                            <li className="nav-item">
                                <a className="nav-link" data-toggle="collapse" href="#contacts" role="button" aria-expanded="false" aria-controls="contacts">
                                    <Users size="16" />
                                    <span style={{ marginLeft: '15px' }} className="link-title">{LOCALES[lan]['web_wallet']['contacts']}</span>
                                    <i className="link-arrow" data-feather="chevron-down" />
                                </a>
                                <div className="collapse" id="contacts">
                                    <ul className="nav sub-menu">
                                        <li className="nav-item">
                                            <Link to="/contacts" className="nav-link">{LOCALES[lan]['web_wallet']['contacts_list']}</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link to="/add-contact" className="nav-link">{LOCALES[lan]['web_wallet']['add_contact']}</Link>
                                        </li>
                                    </ul>
                                </div>
                            </li>

                            <li className="nav-item nav-category">{LOCALES[lan]['web_wallet']['rankings']}</li>
                            <li className="nav-item">
                                <a className="nav-link" data-toggle="collapse" href="#rankings" role="button" aria-expanded="false" aria-controls="rankings">
                                    <Award size="16" />
                                    <span style={{ marginLeft: '15px' }} className="link-title">{LOCALES[lan]['web_wallet']['rankings']}</span>
                                    <i className="link-arrow" data-feather="chevron-down" />
                                </a>
                                <div className="collapse" id="rankings">
                                    <ul className="nav sub-menu">
                                        <li className="nav-item">
                                            <Link to="/rankings" className="nav-link">{LOCALES[lan]['web_wallet']['global_rankings']}</Link>
                                        </li>
                                    </ul>
                                </div>
                            </li>

                            <li className="nav-item nav-category">{LOCALES[lan]['web_wallet']['transactions']}</li>
                            <li className="nav-item">
                                <a className="nav-link" data-toggle="collapse" href="#transactions" role="button" aria-expanded="false" aria-controls="transactions">
                                    <Repeat size="16" />
                                    <span style={{ marginLeft: '15px' }} className="link-title">{LOCALES[lan]['web_wallet']['transactions']}</span>
                                    <i className="link-arrow" data-feather="chevron-down" />
                                </a>
                                <div className="collapse" id="transactions">
                                    <ul className="nav sub-menu">
                                        <li className="nav-item">
                                            <Link to="/txs" className="nav-link">{LOCALES[lan]['web_wallet']['txs_history']}</Link>
                                        </li>
                                        {/* <li className="nav-item">
                                            <a href={`${process.env.WEB_HOST}io-history`} className="nav-link">Deposit / Withdraw History</a>
                                        </li> */}
                                    </ul>
                                </div>
                            </li>


                        </ul>
                    </div>
                </nav>

            </Fragment>
        )
    }
}

function mapStateToProps({ auth, user, sidebar, language }) {
    return {
        token: auth && auth.token,
        user,
        sidebar,
        lan: language ? language : 'en'
    }
}
export default connect(mapStateToProps)(Sidebar)

