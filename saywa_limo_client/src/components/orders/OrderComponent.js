import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { cancelOrder, getOrder } from "../../store/orders/OrderSlice";
import Cookies from "js-cookie";
import "./orders.css";
import { Box, Button, Skeleton } from "@mui/material";
import { FaReceipt } from "react-icons/fa";
import { useSelector } from "react-redux";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { LoadingButton } from "@mui/lab";
import { tr } from "date-fns/locale";

function OrderComponent() {
  const { isLoading, orders } = useSelector((state) => state?.orders);
  const dispatch = useDispatch();
  const [pageCount, setPageCount] = useState(5);
  const [noOfBookingCount, setNoOfBookingCount] = useState();

  const [show, setShow] = useState(false);
  const [tripData, setTripData] = useState("");
  const [Gratuity, setGratuity] = useState("");
  const [extraDistance, setExtraDistance] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = (item) => {
    console.log(
      parseInt(item.totalKms) > parseInt(item.vehicle[0].baseDistance)
    );
    if (item) {
      setTripData(item);
      if (parseInt(item.totalKms) > parseInt(item.vehicle[0].baseDistance)) {
        setExtraDistance(
          (parseInt(item.totalKms) - parseInt(item.vehicle[0].baseDistance)) *
            parseInt(item.vehicle[0].pricePerUnitDistance)
        );
        console.log(
          "111",
          (parseInt(item.totalKms) - parseInt(item.vehicle[0].baseDistance)) *
            parseInt(item.vehicle[0].pricePerUnitDistance)
        );

        console.log("123", typeof item.vehicle[0].pricePerUnitDistance);

        setGratuity(
          parseInt(item.vehicle[0].basePrice) +
            (item.nightCharge ? parseInt(item.nightCharge) : 0) +
            (parseInt(item.totalKms) - parseInt(item.vehicle[0].baseDistance)) *
              parseInt(item.vehicle[0].pricePerUnitDistance)
        );
      } else {
        setExtraDistance(0);
        setGratuity(
          parseInt(item.vehicle[0].basePrice) +
            (item.nightCharge ? parseInt(item.nightCharge) : 0)
        );
        // console.log("gcashd",parseInt(item.vehicle[0].basePrice) +
        // item.nightCharge?parseInt(item.nightCharge):0)
        // console.log("11111",
        // item.nightCharge?parseInt(item.nightCharge):0)
        // console.log("22222",
        // parseInt(item.vehicle[0].basePrice))
        // console.log("33333",
        // (parseInt(item.vehicle[0].basePrice)+(item.nightCharge?parseInt(item.nightCharge):0)))
      }
    }

    setShow(true);
  };

  const cid = JSON.parse(Cookies.get("udtl")).uid;

  const cancelOrders = (res) => {
    const data = {
      _id: cid,
      email: res.customerData[0].email,
      paymentReference: res.paymentReference,
      id: res._id,
      paymentRefNo: res.paymentId,
      cancelationAmount:
        parseFloat(res.totalAmount) - parseFloat(res.totalAmount) * 0.1,
    };
    dispatch(cancelOrder(data));
  };
  useEffect(() => {
    setNoOfBookingCount(orders?.count - orders?.data?.length);
  }, [orders?.count, orders?.data?.length]);

  const loadMoreAction = () => {
    // setNoOfBookingCount((noOfBookingCount-orders?.data?.length)>0?noOfBookingCount-orders?.data?.length:0)

    setPageCount(pageCount + 5);
    const data = {
      _id: cid,
      pageCount: pageCount + 10,
    };
    dispatch(getOrder(data));
  };
  useEffect(() => {
    const data = {
      _id: cid,
      pageCount: 5,
    };
    dispatch(getOrder(data));
    // eslint-disable-next-line
  }, []);

  // useEffect(() => {
  //   const data = {
  //     _id: cid,
  //   };
  //   dispatch(getOrder(data));
  //   // eslint-disable-next-line
  // }, []);
  // const cancelAction = (res) => {
  //   const data = {
  //     tripId: res,
  //   };
  //   dispatch(cancelOrder(data));
  //   window.location.reload();
  // };

  useEffect(() => {
    // const data = {
    //   _id: cid,
    // };
    // dispatch(getOrder(data))
    // eslint-disable-next-line
  }, []);

  const [downloadLoading, setDownloadLoading] = useState(false);
  const downloadInvoice = async (data) => {
    setDownloadLoading(true);
    try {
      const response = await axios({
        url: `${process.env.REACT_APP_BASE_URL}/api/trip/download-invoice`, // Change URL if needed
        method: "POST",
        data: { data },
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "invoice.pdf");
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      setDownloadLoading(false);
    } catch (error) {
      console.error("Error downloading file:", error);
      setDownloadLoading(false);
    }
  };

  return (
    <div>
      {isLoading ? (
        <div className="d-flex flex-column gap-0">
          <Skeleton
            width="100%"
            height="100px"
            style={{ margin: 0, padding: 0 }}
          />
          <Skeleton
            width="100%"
            height="100px"
            style={{ margin: 0, padding: 0 }}
          />
          <Skeleton
            width="100%"
            height="100px"
            style={{ margin: 0, padding: 0 }}
          />
          <Skeleton
            width="100%"
            height="100px"
            style={{ margin: 0, padding: 0 }}
          />
          <Skeleton
            width="100%"
            height="100px"
            style={{ margin: 0, padding: 0 }}
          />
          <Skeleton
            width="100%"
            height="100px"
            style={{ margin: 0, padding: 0 }}
          />
          <Skeleton
            width="100%"
            height="100px"
            style={{ margin: 0, padding: 0 }}
          />
          <Skeleton
            width="100%"
            height="100px"
            style={{ margin: 0, padding: 0 }}
          />
        </div>
      ) : (
        <div className="fadeIn">
          {orders?.data?.map((res, i) => (
            <div
              className="order-order-card order-order-boxx"
              style={{ cursor: "pointer" }}
              onClick={() => {
                handleShow(res);
              }}
            >
              <div className="d-flex gap-2 justify-content-between pt-2 pb-3">
                <div>
                  <div className="gap-2 order-place-container">
                    <div style={{ fontSize: "18px", fontWeight: "700" }}>
                      {res.source}
                    </div>
                    <div style={{ fontSize: "18px", fontWeight: "700" }}>
                      - {res.destination}
                    </div>
                  </div>
                  <div className="d-flex gap-2 align-items-end">
                    <div style={{ fontSize: "12px", fontWeight: "400" }}>
                      Trip No ---
                    </div>
                    <div style={{ fontSize: "12px", fontWeight: "400" }}>
                      {res.tripNo}
                    </div>
                  </div>
                </div>
                <div className="mobHide">
                  {/* <Button
                style={{
                  background: "#c49b6b",
                  color: "white",
                  fontWeight: "900",
                }}
              >
                Manage Booking
              </Button> */}
                </div>
              </div>
              <div className="order-ticket-border mt-2 mb-2">
                {res.tripStatus}
              </div>
              <div className=" pt-2 pb-3 order-place-container justify-content-between">
                <div>
                  <div style={{ fontSize: "10px" }}>Ordered on</div>
                  <div style={{ fontSize: "16px", fontWeight: "700" }}>
                    {moment(res.created_at).format("MM-DD-YYYY, hh:mm A")}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "10px" }}>Reserved on</div>
                  <div style={{ fontSize: "16px", fontWeight: "700" }}>
                    {res.scheduledDate}, {res.scheduledTime}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "10px" }}>VEHICLE</div>
                  <div style={{ fontSize: "16px", fontWeight: "700" }}>
                    {res.vehicle[0].vehicleName}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "10px" }}>DRIVER</div>
                  <div style={{ fontSize: "18px", fontWeight: "700" }}>
                    {res?.drivers[0]?.firstName} {res?.drivers[0]?.lastName}
                  </div>
                </div>
                <div
                  style={{
                    fontWeight: "600",
                    color: "#008df9",
                    cursor: "pointer",
                  }}
                  className="mobHide"
                >
                  Preview
                </div>
              </div>
              <div
                style={{ display: "flex", justifyContent: "end" }}
                className="mobHide"
              >
                <div>
                  <div style={{ fontSize: "10px" }}>Total Amount</div>
                  <div style={{ fontSize: "18px", fontWeight: "700" }}>
                    {`$ ${res.totalAmount}`}
                  </div>
                </div>
                {/* <div>
                  <div style={{ fontSize: "10px" }}>Invoice</div>
                  <div style={{ fontWeight: "600", cursor: "pointer" }}>
                    <FaReceipt /> Download Invoice
                  </div>
                </div> */}
              </div>
              {/* <div>
                {res.tripStatus === "Booked" ? (
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => cancelOrders(res)}
                  >
                    Cancel
                  </Button>
                ) : null}
              </div> */}
            </div>
          ))}
          {noOfBookingCount > 0 ? (
            orders?.data?.length >= 5 ? (
              <div className="text-center" onClick={() => loadMoreAction()}>
                <Button
                  variant="contained"
                  style={{ color: "white", background: "black" }}
                >
                  Load More
                </Button>
              </div>
            ) : null
          ) : null}
        </div>
      )}
      <Modal show={show} centered onHide={handleClose} animation={false}>
        <Modal.Header closeButton>
          {/* <Modal.Title>Modal heading</Modal.Title> */}
        </Modal.Header>
        <Modal.Body style={{ border: "1px solid #e5bb73" }}>
          {tripData ? (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div>
                <label style={{ fontWeight: "600" }}>
                  {tripData.customerName}
                </label>
                <br></br>
                <label>{tripData.rideType}</label>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  margin: "1.5rem 0",
                }}
              >
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <label>Base Fee</label>
                  <label>$ {tripData.vehicle[0].basePrice}</label>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <label>Prime Time Fee</label>
                  <label>
                    $ {tripData.nightCharge ? tripData.nightCharge : 0}
                  </label>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <label>Gratuity</label>
                  <label>
                    $ {Math.round((Gratuity * tripData.gratuityAmount) / 100)}
                  </label>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <label>Mileage Fee</label>
                  <label>$ {extraDistance}</label>
                </div>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <label>Discount</label>
                  <label>
                    $ {tripData.discount ? Math.round(tripData.discount) : 0}
                  </label>
                </div>
                <hr></hr>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    margin: "1.5rem 0",
                  }}
                >
                  <label>Total Amount</label>
                  <label style={{ fontWeight: "600" }}>
                    $ {tripData.totalAmount}
                  </label>
                </div>
              </div>
            </div>
          ) : (
            <div>
              <label>No Data</label>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="d-flex gap-2 flex-wrap">
          <LoadingButton
            loading={downloadLoading}
            loadingIndicator={<div>Downloading...</div>}
            variant="contained"
            style={{ background: downloadLoading ? "grey" : "black" }}
            startIcon={<FaReceipt />}
            // style={{ color: "white", background: "black" }}
            onClick={() => downloadInvoice(tripData)}
          >
            Download Invoice
          </LoadingButton>
          <Button
            variant="outlined"
            style={{
              color: "black",
              background: "white",
              border: "1px solid black",
            }}
            onClick={handleClose}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default OrderComponent;
