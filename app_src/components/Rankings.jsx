import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Link } from "react-router-dom";
// Components
import DashboardTemplate from './DashboardTemplate'
import ReactLoading from 'react-loading';

// Components
import Loading from './Loading'

// API
import { getRankings } from '../utils/api'

// Libraries
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { PlusCircle } from 'react-feather';

// Locales
import en from '../locales/en'
import fr from '../locales/fr'
import nl from '../locales/nl'
import es from '../locales/es'
import pt from '../locales/pt'
import ja from '../locales/ja'
import zh from '../locales/zh'
const LOCALES = { en, fr, nl, es, pt, ja, zh }

class Rankings extends Component {

    state = {
        rankings: '',
        period: 'week',
        loading: true
    }

    componentDidMount() {
        const { token, lan } = this.props
        document.title = `${LOCALES[lan]['web_wallet']['rankings']} | Jiwards`

        getRankings({ period: 'week', token })
            .then(data => data.json())
            .then((res) => {
                if (res.status === 'OK') {
                    console.log(res.payload)
                    this.setState({ loading: false, rankings: res.payload })
                }
            })
    }

    handlePeriodSelect = (period) => {
        const { token } = this.props
        getRankings({ period, token })
            .then(data => data.json())
            .then((res) => {
                if (res.status === 'OK') {
                    console.log(res.payload)
                    this.setState({ loading: false, rankings: res.payload, period })
                }
            })
    }

    render() {
        const { rankings, period, loading } = this.state
        const { lan } = this.props

        if (loading) {
            return <Loading />
        }

        return (
            <DashboardTemplate>
                <div className="page-content">
                    <nav className="page-breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a className="a-whitebg" href="#">{LOCALES[lan]['web_wallet']['rankings']}</a></li>
                            <li className="breadcrumb-item active" aria-current="page">{this.state.period}</li>
                        </ol>
                    </nav>

                    <div className="row mt-4">
                        <div className="col-md-12 grid-margin stretch-card">
                            <div className="card">
                                <div className="card-body">
                                    <h6 className="card-title">{LOCALES[lan]['web_wallet']['rankings']}</h6>
                                    <div style={{ marginBottom: '10px' }}>
                                        <button onClick={e => { e.preventDefault(); this.handlePeriodSelect('week') }} className={period === 'week' ? "btn btn-primary mb-1" : "btn btn-light mb-1"} style={{ marginRight: '5px' }}>{LOCALES[lan]['web_wallet']['week']}</button>
                                        <button onClick={e => { e.preventDefault(); this.handlePeriodSelect('month') }} className={period === 'month' ? "btn btn-primary mb-1" : "btn btn-light mb-1"} style={{ marginRight: '5px' }}>{LOCALES[lan]['web_wallet']['month']}</button>
                                        <button onClick={e => { e.preventDefault(); this.handlePeriodSelect('year') }} className={period === 'year' ? "btn btn-primary mb-1" : "btn btn-light mb-1"}>{LOCALES[lan]['web_wallet']['year']}</button>

                                        <div style={{ float: 'right' }}>
                                            <ReactHTMLTableToExcel
                                                className="btn btn-light mb-1 "
                                                table="rankingsTable"
                                                filename="rankings"
                                                sheet="rankings"
                                                buttonText="Excel"
                                            />
                                        </div>

                                    </div>
                                    <div className="table-responsive">
                                        <table className="table table-hover" id="rankingsTable">
                                            <thead>
                                                <tr>
                                                    <td>Rank</td>
                                                    <td>ID</td>
                                                    <td>{LOCALES[lan]['web_wallet']['name']}</td>
                                                    <td>{LOCALES[lan]['web_wallet']['username']}</td>
                                                    <td>{LOCALES[lan]['web_wallet']['email']}</td>
                                                    <td>{LOCALES[lan]['web_wallet']['amount']}</td>

                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    rankings && rankings.length > 0
                                                        ?
                                                        rankings.filter(rank => rank.userId !== null).map((rank, index) => (
                                                            <tr key={index}>
                                                                <td>{index + 1}</td>
                                                                <td>{rank.user.id}</td>
                                                                <td>{rank.user.firstName + ' ' + rank.user.lastName}</td>
                                                                <td>{rank.user.username}</td>
                                                                <td>{rank.user.email}</td>
                                                                <td>{parseFloat(rank.total_amount)}</td>

                                                            </tr>
                                                        ))
                                                        :
                                                        <tr>
                                                            <td>-</td>
                                                            <td>-</td>
                                                            <td>-</td>
                                                            <td>-</td>
                                                            <td>-</td>
                                                            <td>-</td>
                                                        </tr>
                                                }
                                            </tbody>
                                        </table>
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


function mapStateToProps({ auth, language }) {
    return {
        token: auth && auth.token,
        lan: language ? language : 'en'
    }
}
export default connect(mapStateToProps)(Rankings)
