import React, { Component, Fragment, useCallback } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom';

import { Link } from "react-router-dom";
// Components
import DashboardTemplate from './DashboardTemplate'
import ReactLoading from 'react-loading';

// Components
import Loading from '../Loading'

import DropZone from './DropZone'

// API
import { getRequiredDocument, updateRequiredDocument } from '../../utils/api'

class EditRequiredDocument extends Component {

    state = {
        documentName: '',
        documentType: '',
        documentExp: '',
        serverMsg: '',
        serverStatus: '',
        loading: true
    }

    componentDidMount() {
        const { token } = this.props
        let { documentId } = this.props.match.params

        getRequiredDocument({ documentId, token })
            .then(data => data.json())
            .then((res) => {
                if (res.status === 'OK') {
                    console.log(res.payload)
                    this.setState({
                        loading: false,
                        documentName: res.payload.documentName,
                        documentType: res.payload.documentType,
                        documentExp: res.payload.documentExp
                    })
                }
            })
    }

    handleSubmitBtn = (e) => {
        e.preventDefault()
        const { documentId } = this.props.match.params
        const { documentName, documentType, documentExp } = this.state
        const { token } = this.props
        
        if(!documentName || !documentType || !documentExp) {
            this.setState({serverMsg: 'Ingresa todos los campos requeridos', serverStatus: 'ERROR'})
            return
        }

        updateRequiredDocument({ documentId, documentName, documentType, documentExp, token })
            .then(data => data.json())
            .then((res) => {
                console.log(res.status)
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
        const { documentId } = this.props.match.params
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
                            <li className="breadcrumb-item " aria-current="page">Editar</li>
                            <li className="breadcrumb-item active" aria-current="page">{documentId}</li>
                        </ol>
                    </nav>

                    <div className="row mt-4">
                        <div className="col-md-6 col-xs-12 col-sm-12 grid-margin stretch-card">
                            <div className="card">
                                <div className="card-body">
                                    <div className="card-body">
                                        <h6 className="card-title">Editar Documento</h6>
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
                                            <button onClick={this.handleSubmitBtn} className="btn btn-primary mr-2">Actualizar Documento</button>
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
export default connect(mapStateToProps)(withRouter(EditRequiredDocument))
