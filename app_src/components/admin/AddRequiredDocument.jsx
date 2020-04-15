import React, { Component, Fragment, useCallback } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';

import { Link } from "react-router-dom";
// Components
import DashboardTemplate from './DashboardTemplate'
import ReactLoading from 'react-loading';

// Components
import Loading from '../Loading'



// API
import { createRequiredDocument } from '../../utils/api'

class AddRequiredDocument extends Component {

    state = {
        documentName: '',
        documentType: 'DRIVER',
        documentExp: '30',
        serverMsg: '',
        serverStatus: '',
        loading: false
    }
   

    handleSubmitBtn = (e) => {
        e.preventDefault()        
        const { documentName, documentType, documentExp } = this.state
        const { token } = this.props
        
        if(!documentName || !documentType || !documentExp) {
            this.setState({serverMsg: 'Ingresa todos los campos requeridos', serverStatus: 'ERROR'})
            return
        }

        createRequiredDocument({ documentName, documentType, documentExp, token })
            .then(data => data.json())
            .then((res) => {
                console.log(res)
                if (res.status == 'OK') {      
                    console.log(res.status)              
                    this.setState({
                        documentName: '',
                        documentType: 'DRIVER',
                        documentExp: '30',
                        serverMsg: res.message,
                        serverStatus: 'OK'
                    })
                } else {
                    this.setState({serverMsg: res.messsage, serverStatus: 'ERROR'})
                }
            })
            .catch((err) => {
                console.log(err)
                this.setState({serverMsg: 'Ocurrió un error al intentar realización la acción', serverStatus: 'ERROR'})
            })
    }

    handleNameChange = (e) => {
        e.preventDefault()
        this.setState({ documentName: e.target.value })
    }

    handleDocumentTypeChange = (e) => {
        e.preventDefault()
        this.setState({ documentType: e.target.value })
    }

    handleDocumentExpChange = (e) => {
        e.preventDefault()
        this.setState({ documentExp: e.target.value })
    }

    handleGoBack = (e) => {
        e.preventDefault()
        this.props.history.goBack()
    }

    render() {
        const { serverMsg, serverStatus, loading } = this.state        
        const days = 30

        if (loading) {
            return <Loading />
        }

        return (
            <DashboardTemplate>
                <div className="page-content">
                    <nav className="page-breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="#">Documentos</a></li>
                            <li className="breadcrumb-item " aria-current="page">Añadir</li>                            
                        </ol>
                    </nav>

                    <div className="row mt-4">
                        <div className="col-md-6 col-xs-12 col-sm-12 grid-margin stretch-card">
                            <div className="card">
                                <div className="card-body">
                                    <div className="card-body">
                                        <h6 className="card-title">Añadir Documento</h6>
                                        <form className="forms-sample">
                                            {
                                                serverMsg
                                                    &&
                                                    <div className={serverStatus === 'OK' ? "alert alert-success" : "alert alert-danger"} role="alert">
                                                        {serverMsg}
							                        </div>
                                            }
                                            <div className="form-group">
                                                <label htmlFor="exampleInputUsername1">Nombre del documento</label>
                                                <input onChange={this.handleNameChange} type="text" className="form-control" autoComplete="off" placeholder="Nombre del documento" value={this.state.documentName} />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="exampleInputPassword1">Tipo de documento</label>
                                                <select value={this.state.documentType} onChange={this.handleDocumentTypeChange} className="js-example-basic-single w-100 select2-hidden-accessible" aria-hidden="true">
                                                    <option value="DRIVER" >Conductor</option>
                                                    <option value="VEHICLE" >Vehículo</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="exampleInputPassword1">Tiempo mínimo de expiración</label>
                                                <select value={this.state.documentExp} onChange={this.handleDocumentExpChange} className="js-example-basic-single w-100 select2-hidden-accessible" aria-hidden="true">
                                                    {
                                                        [...Array(days)].map((d, i) => (
                                                            <option key={i} value={i + 1}>{i + 1}</option>
                                                        ))
                                                    }
                                                </select>
                                            </div>
                                            <button onClick={this.handleSubmitBtn} className="btn btn-primary mr-2">Añadir Documento</button>
                                            <button onClick={this.handleGoBack} className="btn btn-light">Cancelar</button>
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
export default connect(mapStateToProps)(withRouter(AddRequiredDocument))
