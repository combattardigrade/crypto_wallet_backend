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
import { getServiceVehicle, updateServiceVehicle } from '../../utils/api'

class EditServiceVehicle extends Component {

    state = {        
        vehicleName: '',
        baseFare: '',
        distanceFare: '',
        seatCapacity: '',
        description: '',
        pictureId: '',
        fileData: '',
        serverMsg: '',
        serverStatus: '',
        loading: true
    }

    componentDidMount() {
        const { token } = this.props
        let { vehicleId } = this.props.match.params

        getServiceVehicle({ vehicleId, token })
            .then(data => data.json())
            .then((res) => {
                if (res.status === 'OK') {
                    console.log(res.payload)
                    this.setState({
                        loading: false,
                        vehicleName: res.payload.vehicleName,
                        baseFare: res.payload.baseFare,
                        distanceFare: res.payload.distanceFare,
                        seatCapacity: res.payload.seatCapacity,
                        description: res.payload.description,
                        pictureId: res.payload.pictureId
                    })
                }
            })
    }

    handleSubmitBtn = (e) => {
        e.preventDefault()
        const { vehicleId } = this.props.match.params
        const { vehicleName, baseFare, distanceFare, seatCapacity, description, fileData } = this.state
        const { token } = this.props
        
        if(!vehicleName || !baseFare || !distanceFare || !seatCapacity || !description) {
            this.setState({serverMsg: 'Ingresa todos los campos requeridos', serverStatus: 'ERROR'})
            return
        }

        updateServiceVehicle({ vehicleId, vehicleName, baseFare, distanceFare, seatCapacity, description, imageData: fileData, token })
            .then(data => data.json())
            .then((res) => {
                console.log(res.status)
                if (res.status == 'OK') {      
                    console.log(res.status)              
                    this.setState({
                        vehicleId: '',
                        vehicleName: '',
                        baseFare: '',
                        distanceFare: '',
                        seatCapacity: '',
                        description: '',
                        fileData: '',
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

    saveFileData = (fileData) => {
        this.setState({ fileData })
        console.log(this.state.fileData)
    }

    handleNameChange = (e) => {
        e.preventDefault()
        this.setState({ vehicleName: e.target.value })
    }

    handleBaseFareChange = (e) => {
        e.preventDefault()
        this.setState({ baseFare: e.target.value })
    }

    handleDistanceFareChange = (e) => {
        e.preventDefault()
        this.setState({ distanceFare: e.target.value })
    }

    handleSeatCapacityChange = (e) => {
        e.preventDefault()
        this.setState({ seatCapacity: e.target.value })
    }

    handleDescriptionChange = (e) => {
        e.preventDefault()
        this.setState({ description: e.target.value })
    }

    handleGoBack = (e) => {
        e.preventDefault()
        this.props.history.goBack()
    }

    render() {
        const { serverMsg, serverStatus, loading } = this.state
        const { vehicleId } = this.props.match.params
        
        if (loading) {
            return <Loading />
        }

        return (
            <DashboardTemplate>
                <div className="page-content">
                    <nav className="page-breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="#">Vehículos</a></li>
                            <li className="breadcrumb-item " aria-current="page">Editar</li>
                            <li className="breadcrumb-item active" aria-current="page">{vehicleId}</li>
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
                                                <label>Nombre del vehículo de servicio</label>
                                                <input onChange={this.handleNameChange} type="text" className="form-control" autoComplete="off" placeholder="Nombre del vehículo" value={this.state.vehicleName} />
                                            </div>
                                            <div className="form-group">
                                                <label>Tarifa Base ($0.00)</label>
                                                <input onChange={this.handleBaseFareChange} type="number" className="form-control" autoComplete="off" placeholder="Tarifa base" value={this.state.baseFare} />
                                            </div>
                                            <div className="form-group">
                                                <label>Tarifa por Distancia (Km)</label>
                                                <input onChange={this.handleDistanceFareChange} type="number" className="form-control" autoComplete="off" placeholder="Tarifa base" value={this.state.distanceFare} />
                                            </div>
                                            <div className="form-group">
                                                <label>Capacidad de Asientos</label>
                                                <input onChange={this.handleSeatCapacityChange} type="number" className="form-control" autoComplete="off" placeholder="Tarifa base" value={this.state.seatCapacity} />
                                            </div>
                                            <div className="form-group">
                                                <label>Descripción</label>
                                                <input onChange={this.handleDescriptionChange} type="text" className="form-control" autoComplete="off" placeholder="Tarifa base" value={this.state.description} />
                                            </div>
                                            <div className="form-group">
                                                <label>Ícono del vehículo</label>
                                                <img style={{height:'50px', display: 'block'}} src={process.env.API_HOST + '/picture/' + this.state.pictureId + ''} />
                                            </div>

                                            <DropZone saveFileData={this.saveFileData} multiple={false} />
                                            <button onClick={this.handleSubmitBtn} className="btn btn-primary mr-2">Actualizar Vehículo</button>
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
export default connect(mapStateToProps)(withRouter(EditServiceVehicle))
