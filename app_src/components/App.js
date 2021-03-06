import React, { Component, Fragment } from 'react'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

// Components
import Login from './Login'
import Dashboard from './Dashboard'
import Contacts from './Contacts'
import AddContact from './AddContact'
import ContactDetails from './ContactDetails'
import Rankings from './Rankings'
import Transactions from './Transactions'
import TxDetails from './TxDetails'
import Send from './Send'
import Receive from './Receive'
import Withdraw from './Withdraw'
import Inbox from './Inbox'
import InboxHistory from './InboxHistory'
import InboxTxDetails from './InboxTxDetails'
import Profile from './Profile'
import PaymentRequestDetails from './PaymentRequestDetails'

// Libraries
import detectBrowserLanguage from 'detect-browser-language'

// Actions
import { saveLanguage } from '../actions/language'


class App extends Component {

  componentDidMount() {
    const { dispatch } = this.props
    const languages = ['en', 'fr', 'nl', 'es', 'pt', 'ja', 'zh']
    let lan
    try {
      lan = detectBrowserLanguage()
      lan = lan.split('-')[0]
    } catch (e) {
      console.log(e)
      lan = 'en'
    }

    lan = languages.includes(lan) ? lan : 'en'
    dispatch(saveLanguage(lan))
  }

  render() {
    const { match, auth } = this.props
    console.log(this.props)
    return (
      <Router>
        <Fragment>
          <Route path="/" exact component={Login} />
          <Route path="/login" component={Login} />
          <PrivateRoute path={`/dashboard`} component={Dashboard} auth={auth} />
          <PrivateRoute path={`/contacts`} component={Contacts} auth={auth} />
          <PrivateRoute path={`/contact/:userId`} component={ContactDetails} auth={auth} />
          <PrivateRoute path={`/add-contact`} component={AddContact} auth={auth} />
          <PrivateRoute path={`/rankings`} component={Rankings} auth={auth} />
          <PrivateRoute path={`/txs`} component={Transactions} auth={auth} />
          <PrivateRoute path={`/tx/:txId`} component={TxDetails} auth={auth} />
          <PrivateRoute path={`/paymentRequest/:txId`} component={PaymentRequestDetails} auth={auth} />
          <PrivateRoute path={`/send`} component={Send} auth={auth} />
          <PrivateRoute path={`/receive`} component={Receive} auth={auth} />
          <PrivateRoute path={`/withdraw`} component={Withdraw} auth={auth} />
          <PrivateRoute path={`/inbox`} component={Inbox} auth={auth} />
          <PrivateRoute path={`/inbox-history`} component={InboxHistory} auth={auth} />
          <PrivateRoute path={`/inboxTx/:txId`} component={InboxTxDetails} auth={auth} />
          <PrivateRoute path={`/profile`} component={Profile} auth={auth} />
          <PrivateRoute path={`/settings`} component={Dashboard} auth={auth} />
          <PrivateRoute path={`/io-history`} component={Dashboard} auth={auth} />

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
          :
          window.location.href = `${process.env.KEYCLOAK_URL}/realms/${process.env.KEYCLOAK_REALM}/protocol/openid-connect/logout?redirect_uri=${process.env.SERVER_HOST}login`
        // : (

        //   <Redirect
        //     to={{
        //       pathname: '/login',
        //       state: { from: props.location.pathname }
        //     }}
        //   />
        // )
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