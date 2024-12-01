import React from 'react'
import orderSucess from '../../Imges/order_success.png'

function TripSuccess() {
    return (
        <div>
            <div className='text-center d-flex gap-2 flex-column align-items-center'>
                <img src={orderSucess} alt='' style={{ width: '250px' }} />
                <h2>Trip Scheduled</h2>
                <div>Your Trip no is : <strong>0024658455</strong></div>
                <div>You'll receive an email/sms, once the trip is confirmed.</div>
                <div>Thank you for using the service</div>
            </div>
        </div>
    )
}

export default TripSuccess