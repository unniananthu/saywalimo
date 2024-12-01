import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Button } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { singleOrder } from "../store/orders/SingleOrderSlice";
import { useSelector } from "react-redux";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import { instance } from "../const/ApiHeader";
import { UPDATE_PAYMENT_INFO } from "../const/ApiConst";

function Payment() {
  const clientSecretid = useParams();
  const clientSecret = clientSecretid.id;
  const orderID = clientSecretid.tripid;
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const { orders } = useSelector((state) => state?.singleOrder);

  useEffect(() => {
    const data = {
      id: orderID,
    };
    dispatch(singleOrder(data));
  }, []);

  const handlePayment = async () => {
    if (!stripe || !elements) return;

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: "Guest",
          address: {
            line1: "Guest",
            postal_code: "Guest",
            city: "Guest",
            state: "CA",
            country: "US",
          },
        },
      },
    });

    if (result.error) {
      toast.error("Payment failed", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } else {
      if (result.paymentIntent.status === "succeeded") {
        // Handle payment success, e.g., show a success message
        // alert("show a success message");
        const data = {
          tripId: orderID,
          clientSecret: result?.paymentIntent.client_secret,
          paymentId: result?.paymentIntent.id,
        };
        instance.post(UPDATE_PAYMENT_INFO, data).then((responsex) => {
          toast.success("Payment Success", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });

          setTimeout(() => {
            Navigate("/success");
            sessionStorage.setItem("ordertabindex", 1);
          }, 5000);
        });
      }
    }
  };

  return (
    <div className="container">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      <div className="row">
        <div className="col-12 col-md-7 container pt-5 ">
          <h3>Trip Details</h3>
          <div class="order-order-card order-order-boxx">
            <div class="d-flex gap-2 justify-content-between pt-2 pb-3">
              <div>
                <div class="gap-2 order-place-container">
                  <div style={{ fontSize: "18px", fontWeight: "700" }}>
                    {orders[0]?.source}
                  </div>
                  <div style={{ fontSize: "18px", fontWeight: "700" }}>
                    {orders[0]?.destination}
                  </div>
                </div>
                <div class="d-flex gap-2 align-items-end">
                  <div style={{ fontSize: "12px", fontWeight: "400" }}>
                    Trip Type -
                  </div>
                  <div style={{ fontSize: "12px", fontWeight: "400" }}>
                    {orders[0]?.tripNo}
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
                  {moment(orders[0]?.created_at).format("DD-MM-YYYY, hh:mm A")}
                </div>
              </div>
              <div>
                <div style={{ fontSize: "10px" }}>Reserved on</div>
                <div style={{ fontSize: "16px", fontWeight: "700" }}>
                  {orders[0]?.scheduledDate}, {orders[0]?.scheduledTime},
                </div>
              </div>
              <div>
                <div style={{ fontSize: "10px" }}>VEHICLE</div>
                <div style={{ fontSize: "16px", fontWeight: "700" }}>
                  {orders[0]?.vehicles[0]?.vehicleName}
                </div>
              </div>
              <div>
                <div style={{ fontSize: "10px" }}>DRIVER</div>
                <div style={{ fontSize: "18px", fontWeight: "700" }}> </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-5 pt-5 pb-5">
          <h3>Payment</h3>
          <div className="d-flex justify-content-between pt-3 pb-3">
            <div>Amount payable</div>
            <div>
              <strong>$ {orders[0]?.totalAmount}</strong>
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
            <Button
              type="primary"
              style={{ height: "40px", background: "black" }}
              onClick={() => handlePayment()}
            >
              Pay now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;
