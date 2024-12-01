import { Breadcrumbs, Button } from '@mui/material'
import React from 'react'
import { Form } from 'react-bootstrap'
import DataTable from 'react-data-table-component'
import { Link } from 'react-router-dom'

const data = [
    {
        name: "Economy",
        max_person: '2',
        max_bag: '1',
        status: 'Live',
    },
    {
        name: "Sedan",
        max_person: '3',
        max_bag: '2',
        status: 'Live',
    },
    {
        name: "SUV",
        max_person: '6',
        max_bag: '6',
        status: 'Live',
    },
    {
        name: "Party Limo",
        max_person: '10',
        max_bag: '0',
        status: 'Live',
    }

]

function Categories() {


    const columns = [
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Max Person',
            selector: row => row.max_person,
            sortable: true,
        },
        {
            name: 'Max Bags',
            selector: row => row.max_bag,
            sortable: true,
        },
        {
            name: 'Status',
            selector: row => row.status,
            sortable: true,
        },
    ];

    return (
        <div>
            <Breadcrumbs aria-label="breadcrumb">
                <Link underline="hover" color="inherit" to="/" className='breadcrumpItem'>
                    Home
                </Link>
                <Link color="text.primary" className='breadcrumpItem'>Categories</Link>
            </Breadcrumbs>
            <div className='d-flex justify-content-between align-items-center mt-4'>
                <strong>Categories</strong>
                <div><Link to='/Add_Vehicle'><Button variant='contained'>Add Category</Button></Link></div>
            </div>
            <div className='mb-2 mt-2 col-3'>
                <Form.Control type='search' placeholder='Search...' />
            </div>
            <DataTable
                columns={columns}
                data={data}
                pagination />
        </div>
    )
}

export default Categories