import React from 'react'
import { Row, Col, Spinner } from 'react-bootstrap'
import ReactLoading from 'react-loading';

import './styles.css'

function Loading(props) {
    return (
        <Row style={{ marginTop:'30vh', width:'100%' }}>
            <Col md={{ span: 8, offset: 2 }} style={{ textAlign: 'center' }}>                
                    <ReactLoading className="preloader" type='bubbles' color='#0079fc' height={667} width={375} />                
            </Col>
        </Row>
    )
}

export default Loading