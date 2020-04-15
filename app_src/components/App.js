import React, { Component, Fragment } from 'react'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

// components
import Loading from './Loading'
import Login from './Login'

class App extends Component { 

  render() {
    const { match, auth } = this.props
    console.log(this.props)
    return (
      <Router>
        <Fragment>
          <Route path="/" exact component={Login} />
          <Route path="/login" component={Login} />
        </Fragment>
      </Router>
    )
  }
}

function PrivateRoute({ component: Component, ...rest }) {
  const { auth } = rest
  return (
    <Route
      {...rest}
      render={props =>
        auth !== null ? (
          <Component {...props} />
        )
          : (
            <Redirect
              to={{
                pathname: '/login',
                state: { from: props.location.pathname }
              }}
            />
          )
      }
    />
  )
}

function mapStateToProps({ auth }) {
  return {
    auth
  }
}

export default connect(mapStateToProps)(App)