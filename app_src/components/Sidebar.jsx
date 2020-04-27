import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Box, Inbox, Users, Award, Repeat } from 'react-feather';

// Libraries
import { isBrowser, isMobile } from 'react-device-detect';
import onClickOutside from "react-onclickoutside";

// Actions
import { showSidebar, hideSidebar, resetSidebar } from '../actions/shared'

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
        const { user, sidebar } = this.props

        return (
            <Fragment>
                <nav className="sidebar">
                    <div className="sidebar-header">
                        <a href={`${process.env.WEB_HOST}dashboard`} className="sidebar-brand">
                            Jiwards<span> Wallet</span>
                        </a>
                        <div className={sidebar ? 'sidebar-toggler active' : 'sidebar-toggler not-active'} onClick={this.handleSidebarToggleBtn}>
                            <span />
                            <span />
                            <span />
                        </div>
                    </div>
                    <div style={{ overflowY: 'scroll', overflowX: 'hidden' }} className="sidebar-body" onMouseEnter={this.handleSidebarHover} onMouseLeave={this.handleSidebarBlur}>
                        <ul className="nav">
                            <li className="nav-item nav-category">Total Balance</li>
                            <li className="nav-item">
                                <a href='#' className="nav-link">
                                    <span style={{ marginLeft: '2px', fontSize:'1em' }} className="link-title">{parseFloat(user.balances[0].amount)} JWS</span>
                                </a>
                            </li>

                            <li className="nav-item nav-category">Main</li>
                            <li className="nav-item">
                                <a href={`${process.env.WEB_HOST}dashboard`} className="nav-link">
                                    <Box size="16" />
                                    <span style={{ marginLeft: '15px' }} className="link-title">Dashboard</span>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a href={`${process.env.WEB_HOST}inbox`} className="nav-link">
                                    <Inbox size="16" />
                                    <span style={{ marginLeft: '15px' }} className="link-title">Inbox</span>
                                </a>
                            </li>

                            <li className="nav-item nav-category">Contacts</li>
                            <li className="nav-item">
                                <a className="nav-link" data-toggle="collapse" href="#contacts" role="button" aria-expanded="false" aria-controls="contacts">
                                    <Users size="16" />
                                    <span style={{ marginLeft: '15px' }} className="link-title">Contacts</span>
                                    <i className="link-arrow" data-feather="chevron-down" />
                                </a>
                                <div className="collapse" id="contacts">
                                    <ul className="nav sub-menu">
                                        <li className="nav-item">
                                            <a href={`${process.env.WEB_HOST}contacts`} className="nav-link">Contacts List</a>
                                        </li>
                                        <li className="nav-item">
                                            <a href={`${process.env.WEB_HOST}add-contact`} className="nav-link">Add Contact</a>
                                        </li>
                                    </ul>
                                </div>
                            </li>

                            <li className="nav-item nav-category">Rankings</li>
                            <li className="nav-item">
                                <a className="nav-link" data-toggle="collapse" href="#rankings" role="button" aria-expanded="false" aria-controls="rankings">
                                    <Award size="16" />
                                    <span style={{ marginLeft: '15px' }} className="link-title">Rankings</span>
                                    <i className="link-arrow" data-feather="chevron-down" />
                                </a>
                                <div className="collapse" id="rankings">
                                    <ul className="nav sub-menu">
                                        <li className="nav-item">
                                            <a href={`${process.env.WEB_HOST}rankings`} className="nav-link">Global Rankings</a>
                                        </li>
                                    </ul>
                                </div>
                            </li>

                            <li className="nav-item nav-category">Transactions</li>
                            <li className="nav-item">
                                <a className="nav-link" data-toggle="collapse" href="#transactions" role="button" aria-expanded="false" aria-controls="transactions">
                                    <Repeat size="16" />
                                    <span style={{ marginLeft: '15px' }} className="link-title">Transactions</span>
                                    <i className="link-arrow" data-feather="chevron-down" />
                                </a>
                                <div className="collapse" id="transactions">
                                    <ul className="nav sub-menu">
                                        <li className="nav-item">
                                            <a href={`${process.env.WEB_HOST}txs`} className="nav-link">Transfer History</a>
                                        </li>
                                        <li className="nav-item">
                                            <a href={`${process.env.WEB_HOST}io-history`} className="nav-link">Deposit / Withdraw History</a>
                                        </li>
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

function mapStateToProps({ auth, user, sidebar }) {
    return {
        token: auth && auth.token,
        user,
        sidebar,
    }
}
export default connect(mapStateToProps)(Sidebar)

