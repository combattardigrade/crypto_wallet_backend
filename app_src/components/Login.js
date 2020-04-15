import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'


// components
import Loading from './Loading'

// Actions
import { handleLogin } from '../actions/auth'

class Login extends Component {
    state = {
        loading: true,
        email: '',
        password: '',
        serverMsg: '',
    }

    componentDidMount() {
        document.title = "Login | Jiwards Wallet"
        const { dispatch } = this.props
        this.setState({ loading: false })
    }

    handleSubmit = (e) => {
        e.preventDefault()
        
        const { email, password } = this.state
        const { dispatch, auth } = this.props
        
        if (!email || !password) {           
            this.setState({serverMsg: 'Enter all the required fields'})
            return
        }

        const params = {
            email,
            password,
        }

        dispatch(handleLogin(params, (res) => {
            if(res.status === 'OK') {
                this.props.history.replace('/dashboard')
            } else {
                this.setState({serverMsg: res.message})
            }
        }))
        
    }

    handleEmailChange = (e) => {
        this.setState({email: e.target.value})
    }

    handlePasswordChange = (e) => {
        this.setState({password: e.target.value})
    }

    closeAlert = () => {
        this.setState({ serverRes: '' })
    }

    render() {
        const { serverMsg, loading } = this.state       

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
                                        <div className="auth-left-wrapper" style={{ backgroundImage: 'url(' + process.env.SERVER_HOST + 'images/logo.png)' }}>

                                        </div>
                                    </div>
                                    <div className="col-md-8 pl-md-0">
                                        <div className="auth-form-wrapper px-4 py-5">
                                            <a href="#" className="noble-ui-logo d-block mb-2">Jiwards<span> Wallet</span></a>
                                            <h5 className="text-muted font-weight-normal mb-4">Welcome! Enter your credentials to log in</h5>
                                            <form className="forms-sample">
                                                {
                                                    serverMsg && (
                                                        <div className="alert alert-danger" role="alert">
                                                            {serverMsg}
                                                        </div>
                                                    )
                                                }
                                                <div className="form-group">
                                                    <label>Email</label>
                                                    <input onChange={this.handleEmailChange} value={this.state.email} name="email" type="email" className="form-control" placeholder="Email" />
                                                </div>
                                                <div className="form-group">
                                                    <label>Password</label>
                                                    <input onChange={this.handlePasswordChange} value={this.state.password} name="password" type="password" className="form-control" placeholder="Contraseña" />
                                                </div>
                                                
                                                <div className="mt-3">
                                                    <button onClick={this.handleSubmit} type="submit" href="#" className="btn btn-primary mr-2 mb-2 mb-md-0 text-white">Login</button>
                                                </div>
                                                <a href="#" className="d-block mt-3 text-muted">Forgot your password?</a>
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

function mapStateToProps({ auth }) {
    return {
        auth
    }
}

export default connect(mapStateToProps)(Login)