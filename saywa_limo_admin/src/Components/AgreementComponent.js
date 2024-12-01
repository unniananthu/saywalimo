import moment from "moment";
import React from "react";

function AgreementComponent(props) {
  const data = props.data;

  const justify = {
    textAlign: "justify",
  };

  return (
    <div>
      <div>
        <div className="text-end">
          <>
            <img
              src={data[0].customerdata?.[0]?.documents?.[0]?.url}
              alt=""
              style={{ width: "200px" }}
            />
          </>
        </div>
        <h3 className="text-center">Rental Agreement</h3>

        <p>
          This Rental Agreement (this “Agreement”) is entered into as of the
          later of the signature dates below (the “Effective Date”), by and
          between All Black Limo LLC, a Washington limited liability vendor
          (“Vendor”), and Full Name, with an address at Billing Address and an
          email address of Email Address ("Customer")
        </p>

        <strong> Services. </strong>
        <ul>
          <li style={justify}>
            Nature of Services. Throughout the Term (as defined below), the
            Vendor contracts to rent a passenger vehicle with a chauffeur to
            Customer at the hourly rate as discussed.
          </li>
          <li style={justify}>
            Cancellation. If there is a need for cancellation, the customer can
            cancel up to seventy-two (72) hours before booking without a fee.
            Once the booking is within the seventy-two (72) hour mark, a fee
            will be placed consisting of the initial amount paid for the
            booking.
          </li>
          <li style={justify}>
            Warranty. Vendor warrants that the vehicle has undergone regular
            maintenance and is in good and clean condition. The preceding
            warranty does not warrant that the vehicle will be free from
            unforeseen mechanical defects.
          </li>
          <li style={justify}>
            Payment. Compensating the service provided by Vendor, Customer
            agrees to pay Final Total for the services, including tax, gratuity,
            and fuel surcharge, to be rendered for Hours of Reservation and
            Miles Provided. Any additional hours will be charged at the vehicle
            rate per hour and $6.00 per additional mile over the agreed set
            limit. Miles are based on garage to garage. All hourly reservations
            are automatically subjugated to a minimum of 20% gratuity charge
            that is provided to the chauffeur. Extra gratuity can be handed to
            the chauffeur at the client’s discretion. The client is responsible
            for releasing the chauffeur from their post in the case of wait
            times or service extensions. All wait times and service extensions
            will be charged at a minimum of 1 hour, rounded up.
          </li>
        </ul>

        <strong>Protection of Vendor’s Property & Safety.</strong>
        <ul>
          <li style={justify}>
            Protection of Property. The customer agrees to pay for any/all
            damage and cleaning to the vehicle that becomes required due to the
            conduct of any person in the vehicle. Such damages include, but are
            not limited to, burns, spillage, vomiting, broken glassware,
            scratches, stains, and broken windows, seats, mirrors, etc… For such
            repairs and cleaning, Customer agrees that the charges will be
            assessed to the credit card for the individual or entity who has
            rented the vehicle. If the credit card cannot be charged, Customer
            agrees to remit payment for damages or cleaning within seven (7)
            days of the date of the event. Failure to do so will result in
            additional charges for any missed business due to the damages or
            failed cleaning that has been caused by Customer.
          </li>
          <li style={justify}>
            Assumption of Risk by Customer. Vendor does not guarantee the safety
            or assume any responsibility for any personal articles or items
            lost, stolen, damaged, or left in the vehicle. Vendor is
            additionally not responsible for delays in the vehicle’s departure
            and arrival caused by weather, road conditions, hazards, accidents,
            or other unforeseen events, including acts of God or War
          </li>
          <li style={justify}>
            Guarantee of Safety. In the case of chauffeur negligence during the
            operation of the vehicle resulting in medical injury, commercial
            insurance covers up to $1,000,000.00 in damages. Medical attention
            must be seeked within seventy-two (72) hours of such negligence for
            commercial insurance to be applicable. Notification regarding such
            matters must be provided through writing to the Vendor. The customer
            agrees to indemnify the chauffeur and Vendor for any costs and fees
            incurred in defense of any claim made against them arising out of
            and connected to the rental of the vehicle that has not been proven
            true.
          </li>
          <li style={justify}>
            Safety of Property. As agreed, upon in 2.1, a minimum of $500.00
            will be charged per vehicle as a cleaning fee if the vehicle is a
            mess and results in a lengthy cleanup. In addition, a minimum of
            $1,250.00 will be charged per vehicle if any damages are done to the
            vehicle or if there are any biohazardous materials that need to be
            cleaned such as bodily fluids.
          </li>
          <li style={justify}>
            Rules & Special Conditions. The following activities are prohibited
            in or within one hundred (100) feet of the vehicle.
            <ul>
              <li style={justify}>
                R.1: Consumption of alcoholic beverages (by a minor).
              </li>
              <li style={justify}>
                R.2: All passengers must be wearing seatbelts at all times while
                the vehicle is in motion.
              </li>
              <li style={justify}>
                R.3: Consumption of illegal drugs as well as marijuana/edibles.
              </li>
              <li style={justify}>
                R.4: Smoking of any substance including vaping.
              </li>
              <li style={justify}>R.5: Violent or unruly behavior.</li>
              <li style={justify}>
                R.6: Conduct causing, or in the chauffeur’s opinion likely to
                cause, damage to the vehicle.
              </li>
              <li style={justify}>
                R.7: Conduct interfering with, or in the chauffeur’s view likely
                to interfere with, safe operation of the vehicle.
              </li>
              <li style={justify}>
                R.8: The Vendor expressly reserves the right to terminate or
                cancel service without any refund whatsoever if the chauffeur
                observes a violation of the rules as stated above.
              </li>
            </ul>
          </li>
        </ul>
        <strong>Termination of Agreement.</strong>
        <ul>
          <li style={justify}>
            Term. The Vender shall provide a vehicle service to the Customer on
            Date of Reservation from Pickup Location at Start of Reservation, to
            End of Reservation (the “Agreement Time”) at the hourly rate agreed
            upon above.
          </li>
          <li style={justify}>
            Termination. If the Customer breaches this contract, the Vendor
            shall be entitled to terminate service under the agreement
            immediately to be entitled to his attorney’s fees, the cost of
            collection, and costs incurred in any lawsuits arising out of or in
            connection with the said breach.
          </li>
          <li style={justify}>
            Severability. If any provisions of this contract are deemed void or
            unenforceable, the
          </li>
          <li style={justify}>
            remaining provisions shall remain in full force and effect.
          </li>
          <li style={justify}>
            Jurisdiction. The parties agree that all terms and conditions stated
            herein shall be construed under the law of the State of Washington
            and any action or proceeding brought in connection with or arising
            out of this contract shall be within the jurisdiction of the Pierce
            County District or Pierce County Superior Courts
          </li>
        </ul>
      </div>
      <div>Regards,</div>
      <div>{data[0].customerName}</div>
      <div>{data[0].customerdata[0].email}</div>
      <div>{data[0].customerdata[0].contact_no}</div>
      <div>
        <img
          src={data[0].customerdata[0].signature}
          style={{ width: "200px" }}
          alt=""
        />
      </div>

      {/* <div>
        {data?.documents?.map((res, i) => (
          <img src={res.url} alt="" key={i} style={{ width: "200px" }} />
        ))}
      </div> */}
      <div>Date : {moment(data[0].created_at).format("DD-MM-YYYY")}</div>
    </div>
  );
}

export default AgreementComponent;
