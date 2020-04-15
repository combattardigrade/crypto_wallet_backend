import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { Box, Globe, Users, Archive, Truck } from 'react-feather';

class Sidebar extends Component {
    render() {
       
        return (
            <Fragment>
                <nav className="sidebar">
                    <div className="sidebar-header">
                        <a href="/admin/dashboard" className="sidebar-brand">
                            Bipp<span> Admin</span>
                        </a>
                        <div className="sidebar-toggler not-active">
                            <span />
                            <span />
                            <span />
                        </div>
                    </div>
                    <div className="sidebar-body">
                        <ul className="nav">
                            <li className="nav-item nav-category">Main</li>
                            <li className="nav-item">
                                <a href={`${process.env.ADMIN_PANEL_HOST}/admin/dashboard`} className="nav-link">
                                    <Box size="16" />
                                    <span style={{ marginLeft: '15px' }} className="link-title">Dashboard</span>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a href="#" className="nav-link">
                                    <Globe size="16" />
                                    <span style={{ marginLeft: '15px' }} className="link-title">Vista Global</span>
                                </a>
                            </li>
                            <li className="nav-item nav-category">Cuentas</li>
                            <li className="nav-item">
                                <a className="nav-link" data-toggle="collapse" href="#users" role="button" aria-expanded="false" aria-controls="users">
                                    <Users size="16" />
                                    <span style={{ marginLeft: '15px' }} className="link-title">Usuarios</span>
                                    <i className="link-arrow" data-feather="chevron-down" />
                                </a>
                                <div className="collapse" id="users">
                                    <ul className="nav sub-menu">
                                        <li className="nav-item">
                                            <a href="/admin/users" className="nav-link">Todos los Usuarios</a>
                                        </li>
                                        <li className="nav-item">
                                            <a href="admin/addUser" className="nav-link">Añadir Usuario</a>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" data-toggle="collapse" href="#drivers" role="button" aria-expanded="false" aria-controls="drivers">
                                    <i className="link-icon" data-feather="truck" />
                                    <span className="link-title">Conductores</span>
                                    <i className="link-arrow" data-feather="chevron-down" />
                                </a>
                                <div className="collapse" id="drivers">
                                    <ul className="nav sub-menu">
                                        <li className="nav-item">
                                            <a href="/admin/drivers" className="nav-link">Todos los Conductores</a>
                                        </li>
                                        <li className="nav-item">
                                            <a href="/admin/addDriver" className="nav-link">Añadir Conductor</a>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" data-toggle="collapse" href="#administradores" role="button" aria-expanded="false" aria-controls="administradores">
                                    <i className="link-icon" data-feather="user-plus" />
                                    <span className="link-title">Administradores</span>
                                    <i className="link-arrow" data-feather="chevron-down" />
                                </a>
                                <div className="collapse" id="administradores">
                                    <ul className="nav sub-menu">
                                        <li className="nav-item">
                                            <a href="pages/email/inbox.html" className="nav-link">Todos los Administradores</a>
                                        </li>
                                        <li className="nav-item">
                                            <a href="pages/email/read.html" className="nav-link">Añadir Administrador</a>
                                        </li>
                                    </ul>
                                </div>
                            </li>

                            <li className="nav-item">
                                <a className="nav-link" data-toggle="collapse" href="#usuarios" role="button" aria-expanded="false" aria-controls="usuarios">
                                    <i className="link-icon" data-feather="list" />

                                    <span className="link-title">Cuentas</span>
                                    <i className="link-arrow" data-feather="chevron-down" />
                                </a>
                                <div className="collapse" id="usuarios">
                                    <ul className="nav sub-menu">
                                        <li className="nav-item">
                                            <a href="pages/email/inbox.html" className="nav-link">Todos las Cuentas</a>
                                        </li>
                                        <li className="nav-item">
                                            <a href="pages/email/read.html" className="nav-link">Añadir Cuenta</a>
                                        </li>
                                    </ul>
                                </div>
                            </li>

                            <li className="nav-item">
                                <a className="nav-link" data-toggle="collapse" href="#dispatch" role="button" aria-expanded="false" aria-controls="dispatch">
                                    <i className="link-icon" data-feather="share" />

                                    <span className="link-title">Dispatcher</span>
                                    <i className="link-arrow" data-feather="chevron-down" />
                                </a>
                                <div className="collapse" id="dispatch">
                                    <ul className="nav sub-menu">
                                        <li className="nav-item">
                                            <a href="pages/email/inbox.html" className="nav-link">All Dispatcher</a>
                                        </li>
                                        <li className="nav-item">
                                            <a href="pages/email/read.html" className="nav-link">Add Dispatcher</a>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" data-toggle="collapse" href="#usuarios" role="button" aria-expanded="false" aria-controls="usuarios">
                                    <i className="link-icon" data-feather="zap" />

                                    <span className="link-title">Vendor</span>
                                    <i className="link-arrow" data-feather="chevron-down" />
                                </a>
                                <div className="collapse" id="usuarios">
                                    <ul className="nav sub-menu">
                                        <li className="nav-item">
                                            <a href="pages/email/inbox.html" className="nav-link">All Vendors</a>
                                        </li>
                                        <li className="nav-item">
                                            <a href="pages/email/read.html" className="nav-link">Add Vendor</a>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            <li className="nav-item nav-category">Documentos</li>
                            <li className="nav-item">
                                <a className="nav-link" data-toggle="collapse" href="#documents" role="button" aria-expanded="false" aria-controls="documents">
                                    <Archive size="16" />
                                    <span style={{ marginLeft: '15px' }} className="link-title">Documentos</span>
                                    <i className="link-arrow" data-feather="chevron-down" />
                                </a>
                                <div className="collapse" id="documents">
                                    <ul className="nav sub-menu">
                                        <li className="nav-item">
                                            <a href={`${process.env.ADMIN_PANEL_HOST}/admin/requiredDocuments`} className="nav-link">Todos los Documentos </a>
                                        </li>
                                        <li className="nav-item">
                                            <a href={`${process.env.ADMIN_PANEL_HOST}/admin/addRequiredDocument`} className="nav-link">Añadir Documento </a>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            

                            <li className="nav-item nav-category">Viajes y Vehículos</li>
                            <li className="nav-item">
                                <a className="nav-link" data-toggle="collapse" href="#viajes" role="button" aria-expanded="false" aria-controls="viajes">
                                    <i className="link-icon" data-feather="navigation" />
                                    <span className="link-title">Viajes</span>
                                    <i className="link-arrow" data-feather="chevron-down" />
                                </a>
                                <div className="collapse" id="viajes">
                                    <ul className="nav sub-menu">
                                        <li className="nav-item">
                                            <a href="pages/ui-components/alerts.html" className="nav-link">Todos los Viajes</a>
                                        </li>
                                        <li className="nav-item">
                                            <a href="pages/ui-components/badges.html" className="nav-link">Viajes Programados</a>
                                        </li>

                                    </ul>
                                </div>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" data-toggle="collapse" href="#vehiculos" role="button" aria-expanded="false" aria-controls="vehiculos">
                                    <Truck size="16" />      
                                    <span style={{ marginLeft: '15px' }} className="link-title">Vehículos de servicio</span>
                                    <i className="link-arrow" data-feather="chevron-down" />
                                </a>
                                <div className="collapse" id="vehiculos">
                                    <ul className="nav sub-menu">
                                        <li className="nav-item">
                                            <a href={`${process.env.ADMIN_PANEL_HOST}/admin/serviceVehicles`} className="nav-link">Todos los Vehículos</a>
                                        </li>
                                        <li className="nav-item">
                                            <a href={`${process.env.ADMIN_PANEL_HOST}/admin/addServiceVehicle`} className="nav-link">Añadir Vehículo</a>
                                        </li>
                                    </ul>
                                </div>
                            </li>

                            <li className="nav-item nav-category">Zonas y Ubicaciones</li>
                            <li className="nav-item">
                                <a className="nav-link" data-toggle="collapse" href="#zonas" role="button" aria-expanded="false" aria-controls="zonas">
                                    <i className="link-icon" data-feather="map" />
                                    <span className="link-title">Zonas de Operación</span>
                                    <i className="link-arrow" data-feather="chevron-down" />
                                </a>
                                <div className="collapse" id="zonas">
                                    <ul className="nav sub-menu">
                                        <li className="nav-item">
                                            <a href="pages/general/blank-page.html" className="nav-link">Todas las Zonas</a>
                                        </li>
                                        <li className="nav-item">
                                            <a href="pages/general/blank-page.html" className="nav-link">Añadir Zona</a>
                                        </li>
                                    </ul>
                                </div>

                            </li>
                            <li className="nav-item">
                                <a href="https://www.nobleui.com/html/documentation/docs.html" target="_blank" className="nav-link">
                                    <i className="link-icon" data-feather="map-pin" />
                                    <span className="link-title">Ubicación en vivo</span>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" data-toggle="collapse" href="#ubicaciones" role="button" aria-expanded="false" aria-controls="ubicaciones">
                                    <i className="link-icon" data-feather="move" />
                                    <span className="link-title">Ubicaciones</span>
                                    <i className="link-arrow" data-feather="chevron-down" />
                                </a>
                                <div className="collapse" id="ubicaciones">
                                    <ul className="nav sub-menu">

                                        <li className="nav-item">
                                            <a href="pages/advanced-ui/owl-carousel.html" className="nav-link">Todos los Países</a>
                                        </li>
                                        <li className="nav-item">
                                            <a href="pages/advanced-ui/sweet-alert.html" className="nav-link">Todos los Estados</a>
                                        </li>
                                        <li className="nav-item">
                                            <a href="pages/advanced-ui/sweet-alert.html" className="nav-link">Todas las Ciudades</a>
                                        </li>
                                        <li className="nav-item">
                                            <a href="pages/advanced-ui/sweet-alert.html" className="nav-link">Añadir nueva Ubicación</a>
                                        </li>
                                    </ul>
                                </div>
                            </li>


                            <li className="nav-item nav-category">Finanzas y Pagos</li>

                            <li className="nav-item">
                                <a className="nav-link" data-toggle="collapse" href="#finanzas" role="button" aria-expanded="false" aria-controls="finanzas">
                                    <i className="link-icon" data-feather="dollar-sign" />
                                    <span className="link-title">Finanzas</span>
                                    <i className="link-arrow" data-feather="chevron-down" />
                                </a>
                                <div className="collapse" id="finanzas">
                                    <ul className="nav sub-menu">
                                        <li className="nav-item">
                                            <a href="pages/advanced-ui/owl-carousel.html" className="nav-link">Ingresos por Viajes</a>
                                        </li>
                                        <li className="nav-item">
                                            <a href="pages/advanced-ui/sweet-alert.html" className="nav-link">Historial de Viajes</a>
                                        </li>
                                        <li className="nav-item">
                                            <a href="pages/advanced-ui/sweet-alert.html" className="nav-link">Ingresos de Conductores</a>
                                        </li>
                                        <li className="nav-item">
                                            <a href="pages/advanced-ui/sweet-alert.html" className="nav-link">Ingresos Diarios</a>
                                        </li>
                                        <li className="nav-item">
                                            <a href="pages/advanced-ui/sweet-alert.html" className="nav-link">Ingresos Mensuales</a>
                                        </li>
                                        <li className="nav-item">
                                            <a href="pages/advanced-ui/sweet-alert.html" className="nav-link">Ingresos Anuales</a>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            <li className="nav-item">
                                <a href="https://www.nobleui.com/html/documentation/docs.html" target="_blank" className="nav-link">
                                    <i className="link-icon" data-feather="align-left" />
                                    <span className="link-title">Historial de Pagos</span>
                                </a>
                            </li>


                            <li className="nav-item nav-category">Reseñas y calificaciones</li>
                            <li className="nav-item">
                                <a className="nav-link" data-toggle="collapse" href="#reviews" role="button" aria-expanded="false" aria-controls="reviews">
                                    <i className="link-icon" data-feather="star" />
                                    <span className="link-title">Calificaciones</span>
                                    <i className="link-arrow" data-feather="chevron-down" />
                                </a>
                                <div className="collapse" id="reviews">
                                    <ul className="nav sub-menu">
                                        <li className="nav-item">
                                            <a href="pages/advanced-ui/owl-carousel.html" className="nav-link">Calificación de Usuarios</a>
                                        </li>
                                        <li className="nav-item">
                                            <a href="pages/advanced-ui/sweet-alert.html" className="nav-link">Calificación de Conductores</a>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            <li className="nav-item">
                                <a href="https://www.nobleui.com/html/documentation/docs.html" target="_blank" className="nav-link">
                                    <i className="link-icon" data-feather="message-square" />
                                    <span className="link-title">Testimoniales</span>
                                </a>
                            </li>

                            <li className="nav-item nav-category">Códigos y Recompensas</li>
                            <li className="nav-item">
                                <a className="nav-link" data-toggle="collapse" href="#promo-codes" role="button" aria-expanded="false" aria-controls="promo-codes">
                                    <i className="link-icon" data-feather="percent" />
                                    <span className="link-title">Códigos Promocionales</span>
                                    <i className="link-arrow" data-feather="chevron-down" />
                                </a>
                                <div className="collapse" id="promo-codes">
                                    <ul className="nav sub-menu">
                                        <li className="nav-item">
                                            <a href="pages/advanced-ui/owl-carousel.html" className="nav-link">Todos los Códigos</a>
                                        </li>
                                        <li className="nav-item">
                                            <a href="pages/advanced-ui/sweet-alert.html" className="nav-link">Añadir Código</a>
                                        </li>
                                        <li className="nav-item">
                                            <a href="pages/advanced-ui/sweet-alert.html" className="nav-link">Promo Code User</a>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" data-toggle="collapse" href="#referidos" role="button" aria-expanded="false" aria-controls="referidos">
                                    <i className="link-icon" data-feather="award" />
                                    <span className="link-title">Referidos y Recompensas</span>
                                    <i className="link-arrow" data-feather="chevron-down" />
                                </a>
                                <div className="collapse" id="referidos">
                                    <ul className="nav sub-menu">
                                        <li className="nav-item">
                                            <a href="pages/advanced-ui/owl-carousel.html" className="nav-link">Usuarios Recompensados</a>
                                        </li>
                                        <li className="nav-item">
                                            <a href="pages/advanced-ui/sweet-alert.html" className="nav-link">Regla de Recompensa</a>
                                        </li>
                                        <li className="nav-item">
                                            <a href="pages/advanced-ui/sweet-alert.html" className="nav-link">Actualizar Regla Recompensa</a>
                                        </li>
                                        <li className="nav-item">
                                            <a href="pages/advanced-ui/sweet-alert.html" className="nav-link">Usuario Referido</a>
                                        </li>
                                        <li className="nav-item">
                                            <a href="pages/advanced-ui/sweet-alert.html" className="nav-link">Regla de Referido</a>
                                        </li>
                                        <li className="nav-item">
                                            <a href="pages/advanced-ui/sweet-alert.html" className="nav-link">Actualizar Regla Referido</a>
                                        </li>
                                    </ul>
                                </div>
                            </li>

                            <li className="nav-item nav-category">Atención al Cliente</li>
                            <li className="nav-item">
                                <a className="nav-link" data-toggle="collapse" href="#soporte" role="button" aria-expanded="false" aria-controls="soporte">
                                    <i className="link-icon" data-feather="phone" />
                                    <span className="link-title">Soporte</span>
                                    <i className="link-arrow" data-feather="chevron-down" />
                                </a>
                                <div className="collapse" id="soporte">
                                    <ul className="nav sub-menu">
                                        <li className="nav-item">
                                            <a href="pages/advanced-ui/owl-carousel.html" className="nav-link">Todos los Agentes</a>
                                        </li>
                                        <li className="nav-item">
                                            <a href="pages/advanced-ui/sweet-alert.html" className="nav-link">Añadir Agente</a>
                                        </li>
                                        <li className="nav-item">
                                            <a href="pages/advanced-ui/sweet-alert.html" className="nav-link">Tickets Abiertos</a>
                                        </li>
                                        <li className="nav-item">
                                            <a href="pages/advanced-ui/sweet-alert.html" className="nav-link">Tickets Cerrados</a>
                                        </li>
                                    </ul>
                                </div>
                            </li>
                            
                            <li className="nav-item">
                                <a href="https://www.nobleui.com/html/documentation/docs.html" target="_blank" className="nav-link">
                                    <i className="link-icon" data-feather="box" />
                                    <span className="link-title">Objetos olvidados</span>
                                </a>
                            </li>
                            <li className="nav-item nav-category">Configuraciones</li>
                            <li className="nav-item">
                                <a href="https://www.nobleui.com/html/documentation/docs.html" target="_blank" className="nav-link">
                                    <i className="link-icon" data-feather="settings" />
                                    <span className="link-title">Configuración de Negocio</span>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a href="https://www.nobleui.com/html/documentation/docs.html" target="_blank" className="nav-link">
                                    <i className="link-icon" data-feather="settings" />
                                    <span className="link-title">Configuración de Tarifas</span>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a href="https://www.nobleui.com/html/documentation/docs.html" target="_blank" className="nav-link">
                                    <i className="link-icon" data-feather="settings" />
                                    <span className="link-title">Configuración de Pagos</span>
                                </a>
                            </li>
                            <li className="nav-item">
                                <a href="https://www.nobleui.com/html/documentation/docs.html" target="_blank" className="nav-link">
                                    <i className="link-icon" data-feather="layout" />
                                    <span className="link-title">CMS</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </nav>

            </Fragment>
        )
    }
}

export default Sidebar