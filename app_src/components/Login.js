import React, { Component } from 'react'
import { connect } from 'react-redux'
import axios from 'axios-jsonp-pro'

// components
import Loading from './Loading'

// Actions
import { saveToken } from '../actions/auth'

// API
import { getKeycloakToken, keycloakLogin, getKeycloakTokenWithAuthCode } from '../utils/api'

// libraries
import qs from 'qs'

// Locales
import en from '../locales/en'
import fr from '../locales/fr'
import nl from '../locales/nl'
import es from '../locales/es'
import pt from '../locales/pt'
import ja from '../locales/ja'
import zh from '../locales/zh'
const LOCALES = { en, fr, nl, es, pt, ja, zh }


class Login extends Component {
    state = {
        loading: true,
        email: '',
        password: '',
        serverMsg: '',
    }

    componentDidMount() {
        const { token, lan, location, history, dispatch } = this.props
        document.title = `${LOCALES[lan]['web_wallet']['login']} | Jiwards`
        const query = qs.parse(location.search, { ignoreQueryPrefix: true })

        if (token) {
            history.replace('/dashboard')
            return
        }

        if (!token && !('code' in query)) {
            const URL = `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/auth?client_id=${process.env.KEYCLOAK_CLIENT_ID}&response_type=code&redirect_uri=${process.env.SERVER_HOST}login`
            window.location.href = URL
            return
        }

        if ('code' in query) {

            getKeycloakTokenWithAuthCode({ auth_code: query.code, redirect_uri: `${process.env.SERVER_HOST}login` })
                .then(data => data.json())
                .then((res) => {
                    if (res.status === 'OK') {
                        keycloakLogin({ token: res.token })
                            .then(data => data.json())
                            .then((res2) => {
                                if (res2.status === 'OK') {
                                    dispatch(saveToken(res2.token))
                                    history.replace('/dashboard')
                                } else {
                                    this.setState({ serverMsg: res.message })
                                }
                            })
                    } else {
                        this.setState({ serverMsg: res.message })
                        return
                    }
                })
                .catch((err) => {
                    console.log(err)
                    this.setState({ serverMsg: LOCALES[lan]['error']['general'] })
                    return
                })
        }
    }

    handleSubmit = (e) => {
        e.preventDefault()

        const { email, password } = this.state
        const { dispatch, lan, history } = this.props

        if (!email || !password) {
            this.setState({ serverMsg: LOCALES[lan]['error']['missing_required'] })
            return
        }

        getKeycloakToken({ email, password })
            .then(data => data.json())
            .then((res) => {
                if (res.status === 'OK') {
                    keycloakLogin({ token: res.token })
                        .then(data => data.json())
                        .then((res2) => {
                            if (res2.status === 'OK') {
                                dispatch(saveToken(res2.token))
                                history.replace('/dashboard')
                            } else {
                                this.setState({ serverMsg: res.message })
                            }
                        })
                } else {
                    this.setState({ serverMsg: res.message })
                    return
                }
            })
            .catch((err) => {
                console.log(err)
                this.setState({ serverMsg: LOCALES[lan]['error']['general'] })
                return
            })
    }

    handleEmailChange = (e) => {
        this.setState({ email: e.target.value })
    }

    handlePasswordChange = (e) => {
        this.setState({ password: e.target.value })
    }

    closeAlert = () => {
        this.setState({ serverRes: '' })
    }

    render() {
        const { serverMsg, loading } = this.state
        const { lan } = this.props

        if (loading === true) {
            return <Loading />
        }

        return (
            <div className="page-wrapper full-page">
                <div className="page-content d-flex align-items-center justify-content-center">
                    <div className="row w-100 mx-0 auth-page">
                        <div className="col-md-8 col-xl-6 mx-auto">
                            <div className="card">
                                <div className="row">
                                    <div className="col-md-4 pr-md-0">
                                        <div className="auth-left-wrapper" style={{ backgroundImage: 'url(' + process.env.SERVER_HOST + 'images/logo.png)', backgroundPosition: '50% 50%' }}>

                                        </div>
                                    </div>
                                    <div className="col-md-8 pl-md-0">
                                        <div className="auth-form-wrapper px-4 py-5">
                                            <a href="#" className="noble-ui-logo d-block mb-2 "><span style={{ fontWeight: 900, color: '#031a61' }}>Jiwards</span><span> Wallet</span></a>
                                            <h5 className="text-muted font-weight-normal mb-4">{LOCALES[lan]['web_wallet']['login_welcome_msg']}</h5>
                                            <form className="forms-sample">
                                                {
                                                    serverMsg && (
                                                        <div className="alert alert-danger" role="alert">
                                                            {serverMsg}
                                                        </div>
                                                    )
                                                }
                                                <div className="form-group">
                                                    <label>{LOCALES[lan]['web_wallet']['email']}</label>
                                                    <input onChange={this.handleEmailChange} value={this.state.email} name="email" type="email" className="form-control" placeholder={LOCALES[lan]['web_wallet']['email']} />
                                                </div>
                                                <div className="form-group">
                                                    <label>{LOCALES[lan]['web_wallet']['password']}</label>
                                                    <input onChange={this.handlePasswordChange} value={this.state.password} name="password" type="password" className="form-control" placeholder={LOCALES[lan]['web_wallet']['password']} />
                                                </div>

                                                <div className="mt-3">
                                                    <button onClick={this.handleSubmit} type="submit" href="#" className="btn btn-primary mr-2 mb-2 mb-md-0 text-white">{LOCALES[lan]['web_wallet']['login']}</button>
                                                </div>
                                                <a href="#" className="d-block mt-3 text-muted">{LOCALES[lan]['web_wallet']['forgot_password']}</a>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function mapStateToProps({ auth, language }) {
    return {
        token: auth && auth,
        lan: language ? language : 'en'
    }
}

export default connect(mapStateToProps)(Login)