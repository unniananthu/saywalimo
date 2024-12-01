import React, { useEffect, useState } from 'react'
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import PaymentsIcon from '@mui/icons-material/Payments';
import { Col, } from 'react-bootstrap';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { GET_SINGLE_VEHICLE, IMAGE_BASE_URL } from '../../Const/ApiConst';
import { instance } from '../../Const/ApiHeader';

function TripAction() {

    const [firstImage, setFirstImage] = useState()
    const [vehicleData, setVehicleData] = useState([])
    const [time, setTime] = useState(new Date())
    const [source, setSource] = useState()
    const [destination, setDestination] = useState()
    const [travelTime, setTravelTime] = useState()
    const [travelType, setTravelType] = useState("Distance Charge")
    const [travelKms, setTravelKms] = useState(0)
    const [baseFare, setBaseFare] = useState()
    const [baseFareKms, setBaseFareKms] = useState()
    const [additionalFareHours, setAdditionalFareHours] = useState()
    const [additionalFareKms, setAdditionalFareKms] = useState()
    const location = useLocation()
    const Navigate = useNavigate()
    const [grandTotal, setGrandTotal] = useState(0)
    var baseFinalKms = 0


    const VehicleDataAction = () => {
        const data = {
            vhid: location.state?.vhid
        }

        instance.post(
            GET_SINGLE_VEHICLE,
            data
        ).then(res => {
            setVehicleData(res.data.data)
            setFirstImage(res.data.data[0].images[0]);
            setBaseFare(res.data.data[0].basePrice);
            setBaseFareKms(res.data.data[0].baseDistance)
            setAdditionalFareKms(res.data.data[0].pricePerUnitDistance);
            setAdditionalFareHours(res.data.data[0].pricePerUnitHour);

            res.data.data[0].baseDistance > travelKms ? (
                setGrandTotal(res.data.data[0].basePrice)
            ) : (
                setGrandTotal(((travelKms - res.data.data[0].baseDistance) * res.data.data[0].pricePerUnitDistance) + parseInt(baseFare))
            )

        })
    }


    useEffect(() => {
        VehicleDataAction()
        setSource(location.state?.fromPlace);
        setDestination(location.state?.toPlace);
        setTravelKms(location.state?.toKms - location.state?.fromKms);
        setTravelTime(location.state?.travelTime);
        // eslint-disable-next-line
    }, [])

    const toggleTravelTypeAction = (e) => {
        setTravelType(e.target.value)
        if (e.target.value === 'Distance Charge') {
            baseFareKms > travelKms ? (
                setGrandTotal(baseFare)
            ) : (
                setGrandTotal(((travelKms - baseFareKms) * additionalFareKms) + parseInt(baseFare))
            )
        } else {
            const TravelTime = travelTime.split(" ")
            setGrandTotal(TravelTime[0] * additionalFareHours)
        }

    }

    const loadVehicle = () => {
        return vehicleData.map((res, i) => {
            return <div key={i} className='d-flex gap-4'>
                <Col>
                    <div>
                        <img
                            src={IMAGE_BASE_URL + firstImage}
                            alt=''
                            style={{
                                width: '50vw',
                                height: '50vh',
                                objectFit: 'cover'
                            }} /></div>
                    <div className='d-flex gap-2'>
                        {res.images.map((res, ii) => (
                            <div className='mt-2' key={ii}>
                                <img
                                    src={IMAGE_BASE_URL + res}
                                    alt=''
                                    style={{
                                        width: '150px',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => setFirstImage(res)}
                                />
                            </div>
                        ))}
                    </div>
                </Col>
                <Col>
                    <div>Vehicle name : {res.vehicleName}</div>
                    <div>Vehicle Licence : {res.vehicleNo}</div>
                    <div>Maximum Allowed Travellers : {res.maxPersons}</div>
                    <div>Maximum Allowed Bags: -</div>
                </Col>
            </div>
        })
    }

    const saveTripAction = () => {
        Navigate('/Trip_Success')

    }

    return (
        <div>
            <div className='trip-container'>
                <h5><strong>{source} <TrendingFlatIcon /> {destination}</strong></h5>
                <div className='d-flex gap-2 align-items-center'>
                    <div className='bg-warning p-1'>Tuesday, May 9</div>
                    <small>{travelTime}</small>
                </div>
            </div>

            <div className='trip-container mt-3 d-flex flex-column gap-3'>
                <h5><strong>Vehicle Details</strong></h5>
                {loadVehicle()}
            </div>

            <div className='d-flex gap-4'>
                <div className='trip-container mt-3 d-flex flex-column gap-3 w-100'>
                    <div className='d-flex gap-4 '>
                        <Col>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Select Type</InputLabel>
                                <Select
                                    size='small'
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={travelType}
                                    label="Select Type"
                                    onChange={(e) => toggleTravelTypeAction(e)}
                                >
                                    <MenuItem value={'Distance Charge'}>Distance Charge</MenuItem>
                                    <MenuItem value={'Hourly Charge'}>Hourly Charge</MenuItem>
                                </Select>
                            </FormControl>
                        </Col>

                        <Col>
                            <TextField
                                fullWidth
                                label="Pickup Time"
                                value={time}
                                size='small'
                                type='time'
                                onChange={(e) => setTime(e.target.value)}
                            />
                        </Col>
                    </div>
                    <TextField
                        size='small'
                        multiline
                        label='Remarks'
                        rows={5} />

                </div>
                <div className='trip-container mt-3 d-flex flex-column gap-3 w-100 text-end'>
                    <strong>Price Calculations</strong>

                    <div> Travel Type: {travelType}</div>
                    {/* <div> Base Fare: {baseFare}</div> */}
                    {/* <div> Base Kms: {baseFareKms}</div> */}

                    {travelType === "Distance Charge" ? (
                        <>
                            <div> Additional Fare: {additionalFareKms}</div>
                            <div> Distance: {travelKms}</div>
                        </>
                    ) : (
                        <>
                            <div> Additional Fare: {additionalFareHours}</div>
                            <div> Hours: {travelTime}</div>
                        </>
                    )}
                    {/* <div> Cost: </div> */}
                    <hr />
                    <div> <strong>Grand Total: {grandTotal}</strong> </div>
                    <div className='text-center'>
                        <Button
                            variant='contained'
                            startIcon={<PaymentsIcon />}
                            color='success'
                            onClick={() => saveTripAction()}>Proceed to payment</Button>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default TripAction