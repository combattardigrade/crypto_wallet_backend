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


class Rankings extends Component {

    state = {
        rankings: '',
        period: 'week',
        loading: true
    }

    componentDidMount() {
        const { token } = this.props

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

        if (loading) {
            return <Loading />
        }

        return (
            <DashboardTemplate>
                <div className="page-content">
                    <nav className="page-breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="#">Rankings</a></li>
                            <li className="breadcrumb-item active" aria-current="page">{this.state.period}</li>
                        </ol>
                    </nav>

                    <div className="row mt-4">
                        <div className="col-md-12 grid-margin stretch-card">
                            <div className="card">
                                <div className="card-body">
                                    <h6 className="card-title">Rankings</h6>
                                    <div style={{ marginBottom: '10px' }}>
                                        <button onClick={e => { e.preventDefault(); this.handlePeriodSelect('week') }} className={period === 'week' ? "btn btn-primary mb-1" : "btn btn-light mb-1"} style={{ marginRight: '5px' }}>Week</button>
                                        <button onClick={e => { e.preventDefault(); this.handlePeriodSelect('month') }} className={period === 'month' ? "btn btn-primary mb-1" : "btn btn-light mb-1"} style={{ marginRight: '5px' }}>Month</button>
                                        <button onClick={e => { e.preventDefault(); this.handlePeriodSelect('year') }} className={period === 'year' ? "btn btn-primary mb-1" : "btn btn-light mb-1"}>Year</button>

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
                                                    <td>Name</td>
                                                    <td>Username</td>
                                                    <td>Email</td>
                                                    <td>Amount</td>

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


function mapStateToProps({ auth }) {
    return {
        token: auth && auth.token,

    }
}
export default connect(mapStateToProps)(Rankings)
