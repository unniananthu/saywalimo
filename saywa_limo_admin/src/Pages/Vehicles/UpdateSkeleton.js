import { Breadcrumbs, Link, Skeleton } from '@mui/material'
import React from 'react'
import { Col, Row } from 'react-bootstrap'

function UpdateSkeleton() {
    return (
        <div>
            <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" color="inherit" to="/" className='breadcrumpItem'>
                    Home
                </Link>
                <Link underline="hover" color="inherit" to="/Vehicles" className='breadcrumpItem'>
                    Vehicles
                </Link>
                <Link color="text.primary" className='breadcrumpItem'>Update Vehicle</Link>
            </Breadcrumbs>
            <div className='d-flex justify-content-between align-items-center mt-4'>
                <strong>Vehicles</strong>
            </div>
            <hr />
            <div style={{ display: 'grid', gridTemplateColumns: 'auto auto', columnGap: '30px' }}>
                <Skeleton height={70} />
                <Skeleton height={70} />
                <Skeleton height={70} />
                <Skeleton height={70} />
                <Skeleton height={70} />
                <Skeleton height={70} />
                <Skeleton height={70} />
                <Skeleton height={70} />
            </div>
            <Row className='mt-4'>
                <Col><Skeleton variant="rectangular" height={120} /></Col>
                <Col><Skeleton variant="rectangular" height={120} /></Col>
                <Col><Skeleton variant="rectangular" height={120} /></Col>
                <Col><Skeleton variant="rectangular" height={120} /></Col>
            </Row>
        </div>
    )
}

export default UpdateSkeleton