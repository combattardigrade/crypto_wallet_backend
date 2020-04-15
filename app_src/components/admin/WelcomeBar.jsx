import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'


class WelcomeBar extends Component {
    render() {
        return (
            <div className="page-content">
                <div className="d-flex justify-content-between align-items-center flex-wrap grid-margin">
                    <div>
                        <h4 className="mb-3 mb-md-0">¡Bienvenido Admin!</h4>
                    </div>
                    <div className="d-flex align-items-center flex-wrap text-nowrap">
                        
                        {/* <button type="button" className="btn btn-outline-info btn-icon-text mr-2 d-none d-md-block">
                            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-download btn-icon-prepend"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1={12} y1={15} x2={12} y2={3} /></svg>
                            Import
                        </button> */}
                        <button type="button" className="btn btn-outline-primary btn-icon-text mr-2 mb-2 mb-md-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-printer btn-icon-prepend"><polyline points="6 9 6 2 18 2 18 9" /><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" /><rect x={6} y={14} width={12} height={8} /></svg>
                            Imprimir
                        </button>
                        <button type="button" className="btn btn-primary btn-icon-text mb-2 mb-md-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="feather feather-download-cloud btn-icon-prepend"><polyline points="8 17 12 21 16 17" /><line x1={12} y1={12} x2={12} y2={21} /><path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29" /></svg>
                            Descargar Reporte
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

export default WelcomeBar