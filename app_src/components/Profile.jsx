import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Link } from "react-router-dom";
// Components
import DashboardTemplate from './DashboardTemplate'

// Components
import Loading from './Loading'

// API
import { getUserDetails } from '../utils/api'

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

class Profile extends Component {

    state = {
        user: '',
        loading: false
    }    
    
    componentDidMount() {
        const { lan } = this.props
        document.title = `${LOCALES[lan]['web_wallet']['profile']} | Jiwards`
    }

    render() {
        const { loading } = this.state
        const { user, lan } = this.props

        if (loading) {
            return <Loading />
        }

        return (
            <DashboardTemplate>
                <div className="page-content">
                    <nav className="page-breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a className="a-whitebg" href="#">{LOCALES[lan]['web_wallet']['profile']}</a></li>
                            <li className="breadcrumb-item active" aria-current="page">{user.id}</li>
                        </ol>
                    </nav>

                    <div className="row mt-4">
                        <div className="col-md-6 col-xs-12 col-sm-12 grid-margin stretch-card">
                            <div className="card">
                                <div className="card-body">
                                    <div className="card-body">
                                        <h6 className="card-title">{LOCALES[lan]['web_wallet']['contact_details']}</h6>
                                        <div className="table-responsive">
                                            <table className="table table-hover">
                                                <thead>
                                                    <tr>
                                                        <td>{LOCALES[lan]['web_wallet']['field']}</td>
                                                        <td>{LOCALES[lan]['web_wallet']['value']}</td>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    <tr>
                                                        <td>ID</td>
                                                        <td>{user.id}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>{LOCALES[lan]['web_wallet']['first_name']}</td>
                                                        <td>{user.firstName}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>{LOCALES[lan]['web_wallet']['last_name']}</td>
                                                        <td>{user.lastName}</td>
                                                    </tr>
                                                    <tr>
                                                        <td>{LOCALES[lan]['web_wallet']['username']}</td>
                                                        <td>{user.username}</td>
                                                    </tr>                                                    
                                                    
                                                </tbody>
                                            </table>
                                        </div>                                        
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
export default connect(mapStateToProps)(Profile)
