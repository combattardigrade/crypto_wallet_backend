import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Box, Inbox, Users, Award, Repeat } from 'react-feather';

class Sidebar extends Component {
    render() {
       
        return (
            <Fragment>
                <nav className="sidebar">
                    <div className="sidebar-header">
                        <a href={`${process.env.WEB_HOST}dashboard`} className="sidebar-brand">
                            Jiwards<span> Wallet</span>
                        </a>
                        <div className="sidebar-toggler not-active">
                            <span />
                            <span />
                            <span />
                        </div>
                    </div>
                    <div className="sidebar-body">
                        <ul className="nav">
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

export default Sidebar