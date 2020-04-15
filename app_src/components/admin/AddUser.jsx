import React, { Component, Fragment, useCallback } from 'react'
import { connect } from 'react-redux'
import { Link } from "react-router-dom";
// Components
import DashboardTemplate from './DashboardTemplate'
import ReactLoading from 'react-loading';

// Components
import Loading from '../Loading'
import Dropzone from 'react-dropzone'
import { useDropzone } from 'react-dropzone'
import DropZone from './DropZone'

// API
import { getAllUsersByType } from '../../utils/api'

class AddUser extends Component {

    state = {
        users: '',
        loading: true
    }

    componentDidMount() {
        const { token, dispatch } = this.props
        let { page } = this.props.match.params
        page = page ? page : 1



        getAllUsersByType({ token, accountType: 'USER', page })
            .then(data => data.json())
            .then((res) => {
                if (res.status === 'OK') {
                    console.log(res.payload)
                    this.setState({ loading: false, users: res.payload })
                }
            })
    }

    render() {
        const { users, loading } = this.state

        if (loading) {
            return <Loading />
        }

        return (
            <DashboardTemplate>
                <div className="page-content">
                    <nav className="page-breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="#">Usuario</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Crear</li>
                        </ol>
                    </nav>

                    <div className="row mt-4">
                        <div className="col-md-6 col-xs-12 col-sm-12 grid-margin stretch-card">
                            <div className="card">
                                <div className="card-body">
                                    <div className="card-body">
                                        <h6 className="card-title">Crear Usuario</h6>
                                        <form className="forms-sample">
                                            <div className="form-group">
                                                <label htmlFor="exampleInputUsername1">Nombre</label>
                                                <input type="text" className="form-control" id="exampleInputUsername1" autoComplete="off" placeholder="Nombre" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="exampleInputEmail1">Email</label>
                                                <input type="email" className="form-control" placeholder="Email" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="exampleInputPassword1">Contraseña</label>
                                                <input type="password" className="form-control" autoComplete="off" placeholder="Contraseña" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="exampleInputPassword1">Repetir Contraseña</label>
                                                <input type="password" className="form-control" autoComplete="off" placeholder="Repetir Contraseña" />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="exampleInputPassword1">Teléfono celular</label>
                                                <input type="password" className="form-control" autoComplete="off" placeholder="Teléfono celular" />
                                            </div>
                                            
                                            <DropZone />
                                            <button type="submit" className="btn btn-primary mr-2">Crear Usuario</button>
                                            <button className="btn btn-light">Cancelar</button>
                                        </form>
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
export default connect(mapStateToProps)(AddUser)
