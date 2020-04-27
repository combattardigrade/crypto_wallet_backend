import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Link } from "react-router-dom";
import { Send, Download, Inbox, RefreshCw, Upload } from 'react-feather';

// Actions
import { showSidebar, hideSidebar } from '../actions/shared'
import { logout } from '../actions/auth'

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

    handleLogout = (e) => {
        e.preventDefault()
        const { dispatch } = this.props
        dispatch(logout())
    }

    render() {
        return (

            < nav className="navbar" >
                <a onClick={this.handleNavbarToggleBtn} href="#" className="sidebar-toggler">
                    <i data-feather="menu" />
                </a>
                <div className="navbar-content">
                    <div style={{ display: 'flex', }}>
                        
                        <Link style={{ display: 'flex', marginLeft: '20px', }} to="/send">
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Send size="22" />
                                <div style={{ padding: '5px', fontSize: '18px', fontWeight: 'bold' }}>Send</div>
                            </div>
                        </Link>
                        <div style={{ display: 'flex', alignItems: 'center', marginLeft: '20px', color: '#d6d6d6' }}>|</div>
                        <Link style={{ display: 'flex' }} to="/receive">
                            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '20px' }}>
                                <Download size="22" />
                                <div style={{ padding: '5px', fontSize: '18px', fontWeight: 'bold' }}>Receive</div>
                            </div>
                        </Link>
                        <div style={{ display: 'flex', alignItems: 'center', marginLeft: '20px', color: '#d6d6d6' }}>|</div>
                        <Link style={{ display: 'flex' }} to="/withdraw">
                            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '20px' }}>
                                <Upload size="22" />
                                <div style={{ padding: '5px', fontSize: '18px', fontWeight: 'bold' }}>Widthdraw</div>
                            </div>
                        </Link>
                    </div>
                    <ul className="navbar-nav">
                        <li className="nav-item dropdown nav-notifications">
                            <a className="nav-link dropdown-toggle" href="#" id="notificationDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <RefreshCw />
                            </a>
                        </li>

                        <li className="nav-item dropdown nav-messages">
                            <a className="nav-link dropdown-toggle" href="#" id="messageDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <Inbox size="24" />
                            </a>
                            <div className="dropdown-menu" aria-labelledby="messageDropdown">
                                <div className="dropdown-header d-flex align-items-center justify-content-between">
                                    <p className="mb-0 font-weight-medium">9 New Messages</p>
                                    <a href="#" className="text-muted">Clear all</a>
                                </div>
                                <div className="dropdown-body">
                                    <a href="#" className="dropdown-item">
                                        <div className="figure">
                                            <img src="https://via.placeholder.com/30x30" alt="userr" />
                                        </div>
                                        <div className="content">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <p>Leonardo Payne</p>
                                                <p className="sub-text text-muted">2 min ago</p>
                                            </div>
                                            <p className="sub-text text-muted">Project status</p>
                                        </div>
                                    </a>
                                    <a href="#" className="dropdown-item">
                                        <div className="figure">
                                            <img src="https://via.placeholder.com/30x30" alt="userr" />
                                        </div>
                                        <div className="content">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <p>Carl Henson</p>
                                                <p className="sub-text text-muted">30 min ago</p>
                                            </div>
                                            <p className="sub-text text-muted">Client meeting</p>
                                        </div>
                                    </a>
                                    <a href="#" className="dropdown-item">
                                        <div className="figure">
                                            <img src="https://via.placeholder.com/30x30" alt="userr" />
                                        </div>
                                        <div className="content">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <p>Jensen Combs</p>
                                                <p className="sub-text text-muted">1 hrs ago</p>
                                            </div>
                                            <p className="sub-text text-muted">Project updates</p>
                                        </div>
                                    </a>
                                    <a href="#" className="dropdown-item">
                                        <div className="figure">
                                            <img src="https://via.placeholder.com/30x30" alt="userr" />
                                        </div>
                                        <div className="content">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <p>Amiah Burton</p>
                                                <p className="sub-text text-muted">2 hrs ago</p>
                                            </div>
                                            <p className="sub-text text-muted">Project deadline</p>
                                        </div>
                                    </a>
                                    <a href="#" className="dropdown-item">
                                        <div className="figure">
                                            <img src="https://via.placeholder.com/30x30" alt="userr" />
                                        </div>
                                        <div className="content">
                                            <div className="d-flex justify-content-between align-items-center">
                                                <p>Yaretzi Mayo</p>
                                                <p className="sub-text text-muted">5 hr ago</p>
                                            </div>
                                            <p className="sub-text text-muted">New record</p>
                                        </div>
                                    </a>
                                </div>
                                <div className="dropdown-footer d-flex align-items-center justify-content-center">
                                    <a href="#">View all</a>
                                </div>
                            </div>
                        </li>
                        <li className="nav-item dropdown nav-notifications">
                            <a className="nav-link dropdown-toggle" href="#" id="notificationDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i data-feather="bell" />
                                <div className="indicator">
                                    <div className="circle" />
                                </div>
                            </a>
                            <div className="dropdown-menu" aria-labelledby="notificationDropdown">
                                <div className="dropdown-header d-flex align-items-center justify-content-between">
                                    <p className="mb-0 font-weight-medium">6 New Notifications</p>
                                    <a href="#" className="text-muted">Clear all</a>
                                </div>
                                <div className="dropdown-body">
                                    <a href="#" className="dropdown-item">
                                        <div className="icon">
                                            <i data-feather="user-plus" />
                                        </div>
                                        <div className="content">
                                            <p>New customer registered</p>
                                            <p className="sub-text text-muted">2 sec ago</p>
                                        </div>
                                    </a>
                                    <a href="#" className="dropdown-item">
                                        <div className="icon">
                                            <i data-feather="gift" />
                                        </div>
                                        <div className="content">
                                            <p>New Order Recieved</p>
                                            <p className="sub-text text-muted">30 min ago</p>
                                        </div>
                                    </a>
                                    <a href="#" className="dropdown-item">
                                        <div className="icon">
                                            <i data-feather="alert-circle" />
                                        </div>
                                        <div className="content">
                                            <p>Server Limit Reached!</p>
                                            <p className="sub-text text-muted">1 hrs ago</p>
                                        </div>
                                    </a>
                                    <a href="#" className="dropdown-item">
                                        <div className="icon">
                                            <i data-feather="layers" />
                                        </div>
                                        <div className="content">
                                            <p>Apps are ready for update</p>
                                            <p className="sub-text text-muted">5 hrs ago</p>
                                        </div>
                                    </a>
                                    <a href="#" className="dropdown-item">
                                        <div className="icon">
                                            <i data-feather="download" />
                                        </div>
                                        <div className="content">
                                            <p>Download completed</p>
                                            <p className="sub-text text-muted">6 hrs ago</p>
                                        </div>
                                    </a>
                                </div>
                                <div className="dropdown-footer d-flex align-items-center justify-content-center">
                                    <a href="#">View all</a>
                                </div>
                            </div>
                        </li>
                        <li className="nav-item dropdown nav-profile">
                            <a className="nav-link dropdown-toggle" href="#" id="profileDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <img src="https://via.placeholder.com/30x30" alt="userr" />
                            </a>
                            <div className="dropdown-menu" aria-labelledby="profileDropdown">
                                <div className="dropdown-header d-flex flex-column align-items-center">
                                    <div className="figure mb-3">
                                        <img src="https://via.placeholder.com/80x80" alt="" />
                                    </div>
                                    <div className="info text-center">
                                        <p className="name font-weight-bold mb-0">Amiah Burton</p>
                                        <p className="email text-muted mb-3">amiahburton@gmail.com</p>
                                    </div>
                                </div>
                                <div className="dropdown-body">
                                    <ul className="profile-nav p-0 pt-3">
                                        <li className="nav-item">
                                            <a href="pages/general/profile.html" className="nav-link">
                                                <i data-feather="user" />
                                                <span>Profile</span>
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a href="#" className="nav-link">
                                                <i data-feather="edit" />
                                                <span>Edit Profile</span>
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a href="#" className="nav-link">
                                                <i data-feather="repeat" />
                                                <span>Switch User</span>
                                            </a>
                                        </li>
                                        <li className="nav-item">
                                            <a href="#" className="nav-link">
                                                <i data-feather="log-out" />
                                                <span>Log Out</span>
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

function mapStateToProps({ auth, user, sidebar }) {
    return {
        token: auth && auth.token,
        user,
        sidebar
    }
}
export default connect(mapStateToProps)(Navbar)
