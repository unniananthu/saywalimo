import { Button, Menu, MenuItem, TextField } from '@mui/material';
import React, { useState } from 'react'
import { Places } from '../../Utils/Places';
import { instance } from '../../Const/ApiHeader'
import { GET_VEHICLE_LIST } from '../../Const/ApiConst';
import { useNavigate } from 'react-router-dom';

function AddTripAction() {
    const [vehicleData, setVehicleData] = useState([])
    const [travelTime, setTravelTime] = useState(0)
    const [fromKms, setFromKms] = useState(0)
    const [toKms, setToKms] = useState(0)
    const [fromPlace, setFromPlace] = useState('')
    const [toPlace, setToPlace] = useState('')

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [toanchorEl, setToAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const toopen = Boolean(toanchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const tohandleClick = (event) => {
        setToAnchorEl(event.currentTarget);
    };

    const handleClose = (e) => {
        setFromPlace(e.Place)
        setAnchorEl(null);
        setFromKms(e.kms)
    };
    const handleClosed = (e) => {
        setToPlace(e.Place)
        setToAnchorEl(null);
        setToKms(e.kms)
    };



    const fetchVehicles = () => {

        const time = (parseInt(toKms) - parseInt(fromKms)) / 30
        setTravelTime(time / 100 * 60 + ' Hrs');
        instance.post(GET_VEHICLE_LIST)
            .then(response => {
               
                setVehicleData(response.data.data)
            })
    }


    const Navigate = useNavigate()

    const bookTripAction = (e) => {
        const data = {
            vhid: e._id,
            vehicleData: vehicleData,
            travelTime: travelTime,
            fromKms: fromKms,
            toKms: toKms,
            fromPlace: fromPlace,
            toPlace: toPlace,
        }
        Navigate('/Review_Trip/', { state: data })
    }


    return (
        <div>
            <div className='d-flex gap-4 trip-container'>
                <Button
                    id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                    variant='contained'
                >From</Button>
                <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                >
                    {
                        Places.map((res, i) => (
                            <MenuItem onClick={() => handleClose(res)}>{res.Place}</MenuItem>
                        ))
                    }
                </Menu>
                <Button
                    id="basic-button"
                    aria-controls={toopen ? 'basic-menus' : undefined}
                    aria-haspopup="true"
                    aria-expanded={toopen ? 'true' : undefined}
                    onClick={tohandleClick}
                    variant='contained'
                >To</Button>
                <Menu
                    id="basic-menus"
                    toanchorEl={toanchorEl}
                    open={toopen}
                    onClose={handleClosed}
                    MenuListProps={{
                        'aria-labelledby': 'basic-button',
                    }}
                >
                    {
                        Places.map((ress, i) => (
                            <MenuItem onClick={() => handleClosed(ress)}>{ress.Place}</MenuItem>
                        ))
                    }
                </Menu>

                <TextField
                    size='small'
                    type='date'
                />
                <TextField
                    size='small'
                    type='date'
                />
                <TextField
                    size='small'
                    label='No of Passengers'
                />
                <Button variant='contained' onClick={() => fetchVehicles()}>Search</Button>
            </div>
            <div className=' mt-4'>
                {vehicleData.map((res, i) => (
                    <div key={i} className='d-flex align-items-center justify-content-between trip-container mt-4'>
                        <div>
                            <img
                                src={'http://172.20.10.3:9007/vehicle_images/' + res.images[0]}
                                alt=''
                                style={{ width: '150px' }} />
                            <div className='text-center'>{res.vehicleName} </div>
                        </div>
                        <div>
                            <div className='d-flex'>
                                <div className='me-4'> From: {fromPlace}</div>
                                <div className='ms-4'>To: {toPlace}</div>
                            </div>
                            <div className='d-flex'>
                                <div className='me-4'>
                                    Distance : {toKms - fromKms} Km
                                </div>
                                <div className='ms-4'>
                                    Time : {travelTime}
                                </div>
                            </div>
                        </div>
                        <div>
                            {(parseInt(toKms) - parseInt(fromKms)) > parseInt(res.baseDistance) ? (
                                <h5 className='text-center'><strong>₹ {((parseInt(toKms) - parseInt(fromKms)) - parseInt(res.baseDistance)) * parseInt(res.pricePerUnitDistance) + parseInt(res.basePrice)}</strong></h5>
                            ) : (
                                <h5 className='text-center'><strong>₹ {parseInt(res.basePrice)}</strong></h5>
                            )}

                            <Button variant='contained' const onClick={() => bookTripAction(res)}>Book Now</Button>

                        </div>
                    </div>
                ))}
            </div>
        </div >
    )
}

export default AddTripAction