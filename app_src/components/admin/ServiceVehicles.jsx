import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Link } from "react-router-dom";
// Components
import DashboardTemplate from './DashboardTemplate'
import ReactLoading from 'react-loading';

// Components
import Loading from '../Loading'

// API
import { getServiceVehicles, deleteServiceVehicle } from '../../utils/api'

// Libraries
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

import { PlusCircle } from 'react-feather';


class ServiceVehicles extends Component {

    state = {
        vehicles: '',
        loading: true
    }

    componentDidMount() {
        const { token } = this.props

        getServiceVehicles({ token })
            .then(data => data.json())
            .then((res) => {
                if (res.status === 'OK') {
                    console.log(res.payload)
                    this.setState({ loading: false, vehicles: res.payload })
                }
            })
    }

    handleAddVehicle = (e) => {
        e.preventDefault()
        this.props.history.push('/admin/addServiceVehicle')
    }

    handleDeleteVehicle = (vehicleId) => {
        const { token } = this.props
        const { vehicles } = this.state

        confirmAlert({
            title: 'Confirmación',
            message: '¿Estás seguro que quieres eliminar el vehículo?',
            buttons: [
                {
                    label: 'Sí',
                    onClick: () => {
                        deleteServiceVehicle({ vehicleId, token })
                        this.setState({
                            vehicles: vehicles.filter(v => v.id !== vehicleId)
                        })
                    }
                },
                {
                    label: 'No',
                    onClick: () => { }
                }
            ]
        });

    }

    render() {
        const { vehicles, loading } = this.state

        if (loading) {
            return <Loading />
        }

        return (
            <DashboardTemplate>
                <div className="page-content">
                    <nav className="page-breadcrumb">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item"><a href="#">Vehículos</a></li>
                            <li className="breadcrumb-item active" aria-current="page">Todos</li>
                        </ol>
                    </nav>

                    <div className="row mt-4">
                        <div className="col-md-12 grid-margin stretch-card">
                            <div className="card">
                                <div className="card-body">
                                    <h6 className="card-title">Vehículos de servicio</h6>
                                    <div style={{ marginBottom: '10px' }}>
                                        <ReactHTMLTableToExcel
                                            className="btn btn-light mb-1 "
                                            table="serviceVehiclesTable"
                                            filename="service_vehicles"
                                            sheet="service_vehicles"
                                            buttonText="Excel"
                                        />
                                        <div style={{ float: "right", display: 'flex' }}>
                                            <div style={{ marginRight: '10px', alignItems: 'center', display: 'flex' }}>Buscar:</div>
                                            <input style={{ width: '200px', marginRight: '10px' }} type="text" className="form-control" autoComplete="off" placeholder="Buscar..." />
                                            <button onClick={this.handleAddVehicle} type="button" className="btn btn-primary btn-icon-text mb-2 mb-md-0"><PlusCircle size="16" /> Añadir Vehículo</button>
                                        </div>
                                    </div>
                                    <div className="table-responsive">
                                        <table className="table table-hover" id="serviceVehiclesTable">
                                            <thead>
                                                <tr>
                                                    <td>ID</td>
                                                    <td>Nombre del Vehículo</td>
                                                    <td>Capacidad</td>
                                                    <td>Tarifa Base</td>
                                                    <td>Tarifa por Distancia</td>
                                                    <td>Descripción</td>
                                                    <td>Ícono</td>
                                                    <td>Acción</td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    vehicles && vehicles.length > 0
                                                        ?
                                                        vehicles.map((vehicle, index) => (
                                                            <tr key={index}>
                                                                <td>{vehicle.id}</td>
                                                                <td>{vehicle.vehicleName}</td>
                                                                <td>{vehicle.seatCapacity}</td>
                                                                <td>{vehicle.baseFare}</td>
                                                                <td>{vehicle.distanceFare}</td>
                                                                <td>{vehicle.description}</td>
                                                                <td>
                                                                    <img src={`${process.env.API_HOST}/picture/${vehicle.pictureId}`} />
                                                                </td>
                                                                <td>
                                                                    <Link to={`/admin/serviceVehicle/${vehicle.id}/edit`} className="btn btn-success mb-1 mb-md-0 action-btn"><i className="fa fa-edit btn-icon"></i></Link>
                                                                    <button onClick={e => { e.preventDefault(); this.handleDeleteVehicle(vehicle.id) }} type="button" className="btn btn-danger mb-1 mb-md-0 action-btn"><i className="fa fa-trash btn-icon"></i></button>
                                                                </td>
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
export default connect(mapStateToProps)(ServiceVehicles)
