import React, { Component } from 'react'
import { connect } from 'react-redux'

// Components
import DashboardTemplate from './DashboardTemplate'
import Loading from '../Loading'
import DropZone from './DropZone'

// API
import { createServiceVehicle } from '../../utils/api'

class AddServiceVehicle extends Component {

    state = {
        vehicleName: '',
        baseFare: '',
        distanceFare: '',
        seatCapacity: '',
        description: '',
        fileData: '',
        serverMsg: '',
        serverStatus: '',
        loading: false
    }

    saveFileData = (fileData) => {
        this.setState({ fileData })
        console.log(this.state.fileData)
    }

    handleSubmitBtn = (e) => {
        e.preventDefault()
        const { vehicleName, baseFare, distanceFare, seatCapacity, description, fileData } = this.state
        const { token } = this.props

        if (!vehicleName || !baseFare || !distanceFare || !seatCapacity || !description || !fileData) {
            this.setState({ serverMsg: 'Ingresa todos los campos requeridos', serverStatus: 'ERROR' })
            return
        }

        createServiceVehicle({ vehicleName, baseFare, distanceFare, seatCapacity, description, imageData: fileData, token })
            .then(data => data.json())
            .then((res) => {
                console.log(res)
                if (res.status == 'OK') {
                    console.log(res.status)
                    this.setState({
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
                    this.setState({ serverMsg: res.messsage, serverStatus: 'ERROR' })
                }
            })
            .catch((err) => {
                console.log(err)
                this.setState({ serverMsg: 'Ocurrió un error al intentar realización la acción', serverStatus: 'ERROR' })
            })
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

        if (loading) {
            return <Loading />
        }

        return (
            <DashboardTemplate>
                <div className="page-content">
                    <nav className="page-breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="#">Vehículos</a></li>
                            <li className="breadcrumb-item " aria-current="page">Añadir</li>
                        </ol>
                    </nav>

                    <div className="row mt-4">
                        <div className="col-md-6 col-xs-12 col-sm-12 grid-margin stretch-card">
                            <div className="card">
                                <div className="card-body">
                                    <div className="card-body">
                                        <h6 className="card-title">Añadir Vehículo de servicio</h6>
                                        <form className="forms-sample">
                                            {
                                                serverMsg
                                                &&
                                                <div className={serverStatus === 'OK' ? "alert alert-success" : "alert alert-danger"} role="alert">
                                                    {serverMsg}
                                                </div>
                                            }
                                            <div className="form-group">
                                                <label htmlFor="exampleInputUsername1">Nombre del vehículo de servicio</label>
                                                <input onChange={this.handleNameChange} type="text" className="form-control" autoComplete="off" placeholder="Nombre del vehículo" value={this.state.vehicleName} />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="exampleInputUsername1">Tarifa Base ($0.00)</label>
                                                <input onChange={this.handleBaseFareChange} type="number" className="form-control" autoComplete="off" placeholder="Tarifa base" value={this.state.baseFare} />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="exampleInputUsername1">Tarifa por Distancia (Km)</label>
                                                <input onChange={this.handleDistanceFareChange} type="number" className="form-control" autoComplete="off" placeholder="Tarifa base" value={this.state.distanceFare} />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="exampleInputUsername1">Capacidad de Asientos</label>
                                                <input onChange={this.handleSeatCapacityChange} type="number" className="form-control" autoComplete="off" placeholder="Tarifa base" value={this.state.seatCapacity} />
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="exampleInputUsername1">Descripción</label>
                                                <input onChange={this.handleDescriptionChange} type="text" className="form-control" autoComplete="off" placeholder="Tarifa base" value={this.state.description} />
                                            </div>
                                            <DropZone saveFileData={this.saveFileData} multiple={false} />
                                            <button onClick={this.handleSubmitBtn} className="btn btn-primary mr-2">Añadir Vehículo</button>
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
export default connect(mapStateToProps)(AddServiceVehicle)
