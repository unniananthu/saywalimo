import React, { useEffect, useState } from "react";
import moment from "moment";
import { useSelector } from "react-redux";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Button } from "antd";
import { newOrder } from "../store/orders/OrderSlice";
import { useDispatch } from "react-redux";
import { LoadingButton } from "@mui/lab";

function NewPayment() {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state?.singleOrder);
  const { orderResponse } = useSelector((state) => state?.orders);
  const { locations } = useSelector((state) => state?.locations);
  const { customers } = useSelector((state) => state?.customer);
  const [fileList, setFileList] = useState(customers[0]?.documents);
  const [signatureImage, setSignatureImage] = useState(customers[0]?.signature);
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setSignatureImage(customers[0]?.signature);
      setFileList(customers[0]?.documents);
    }, 100);
    // eslint-disable-next-line
  }, [customers]);

  const handlePayment = async () => {
    setSaveLoading(true);
    const data = {
      source: locations?.source,
      destination: locations?.destination,
      vehicleId: locations?.vehicleId,
      customerId: customers[0]?.user_id,
      customerName: customers[0]?.fullName,
      scheduledDate: locations?.scheduleDate,
      scheduledTime: JSON.parse(sessionStorage.getItem("locationData"))
        .pickupTime,
      // scheduledTime: locations?.scheduleTime,
      shortDescription: locations?.shortDescription,
      // tripStatus: tripStatus,
      totalAmount: locations?.totalAmount,
      paymentStatus: "",
      paymentReference: "",
      paymentMode: "",
      signature: signatureImage,
      documents: fileList,
      meetandgreet: locations.meetAndGreet,
      noOfBags: locations.noOfBags,
      noOfPassengers: locations.noOfPassengers,
      tripOccasion: locations?.tripOccasion,
      tripOccasionDetails: locations?.tripOccasionDetails,
      totalKms: locations?.totalKms,
      totalHours: locations?.hour,
      rideType: locations?.rideType,
      stops: locations?.stops,
      returnDate: locations?.returnDate,
      returnTime: locations?.returnTime,
      seatCount: locations?.seatCount,
      needWheelChair: locations?.needWheelChair,
    };

    console.log(data);

    // dispatch(newOrder(data));
  };

  useEffect(() => {
    // window.location.href = orderResponse;
  }, [orderResponse]);

  return (
    <div className="container p-5">
      <div>MODAL</div>
      <div className="row">
        <div className="col-12 col-md-7 container pt-5 ">
          <h3>Trip Details</h3>
          <div class="order-order-card order-order-boxx">
            <div class="d-flex gap-2 justify-content-between pt-2 pb-3">
              <div>
                <div class="gap-2 order-place-container">
                  <div style={{ fontSize: "18px", fontWeight: "700" }}>
                    {locations?.source}
                  </div>
                  <div style={{ fontSize: "18px", fontWeight: "700" }}>
                    {locations[0]?.destination}
                  </div>
                </div>
                <div class="d-flex gap-2 align-items-end">
                  <div style={{ fontSize: "12px", fontWeight: "400" }}>
                    Trip Type -
                  </div>
                  <div style={{ fontSize: "12px", fontWeight: "400" }}>
                    {locations?.rideType}
                  </div>
                </div>
              </div>
              <div class="mobHide"></div>
            </div>
            <div class="order-ticket-border mt-2 mb-2"></div>
            <div class=" pt-2 pb-3 order-place-container justify-content-between">
              <div>
                <div style={{ fontSize: "10px" }}>Ordered on</div>
                <div style={{ fontSize: "16px", fontWeight: "700" }}>
                  {moment(new Date()).format("DD-MM-YYYY, hh:mm A")}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-5 pt-5 pb-5">
          <h3>Payment</h3>
          <div className="d-flex justify-content-between pt-3 pb-3">
            <div>Amount payable</div>
            <div>
              <strong>$ {locations?.totalAmount}</strong>
            </div>
          </div>
          <div
            style={{
              border: "1px solid #e6e6e6",
              padding: "20px",
              marginBottom: "20px",
              borderRadius: "10px",
            }}
          >
            <CardElement />
          </div>
          <div className="text-center">
            <LoadingButton
              Loading={saveLoading}
              type="primary"
              style={{ height: "40px", background: "black" }}
              onClick={() => handlePayment()}
            >
              Pay now
            </LoadingButton>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewPayment;
