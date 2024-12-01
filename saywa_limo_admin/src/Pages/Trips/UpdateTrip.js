import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { instance } from "../../Const/ApiHeader";
import {
  CANCEL_TRIP,
  GET_DRIVERS_LIST,
  GET_SINGLE_TRIP_DATA,
  IMAGE_BASE_URL,
  SEND_STATUS,
  UPDATE_TRIP_DRIVER,
  VARIFY_TRIP,
} from "../../Const/ApiConst";
import moment from "moment";
import LoadingButton from "@mui/lab/LoadingButton";
import { Box, Breadcrumbs, Button, Modal } from "@mui/material";
import AgreementComponent from "../../Components/AgreementComponent";
import { useDispatch } from "react-redux";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { useReactToPrint } from "react-to-print";
import { FaPrint } from "react-icons/fa6";
import { toastMessage } from "../../store/toast";

function UpdateTrip() {
  const previewCar = {
    height: "150px",
  };
  const params = useParams();
  const [sourceData, setSourceData] = useState([]);
  const [sourceData2, setSourceData2] = useState([]);
  const [driverList, setDriverList] = useState([]);
  const [driverId, setDriverId] = useState("");
  const [updateDriverLoader, setUpdateDriverLoader] = useState(false);
  const Navigate = useNavigate();

  const loadData = async () => {
    const data = {
      id: params.id,
    };
    try {
      await instance
        .post(GET_SINGLE_TRIP_DATA, data)
        .then((response) => {
          setSourceData(response.data.data);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const loadDrivers = () => {
    instance.get(GET_DRIVERS_LIST).then((response) => {
      setDriverList(response.data.data);
    });
  };
  useEffect(() => {
    loadData();
    loadDrivers();
    // eslint-disable-next-line
  }, []);

  const updateDriverData = async () => {
    setUpdateDriverLoader(true);
    const data = {
      driverId: driverId,
      tripId: params.id,
    };
    await instance.post(UPDATE_TRIP_DRIVER, data).then((response) => {
      dispatch(
        toastMessage({
          message: "Driver assigned successfully",
          toastStatus: true,
          type: "success",
        })
      );
      setUpdateDriverLoader(false);
      Navigate("/trips");
    });
  };

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [modalData, setModalData] = useState([]);

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openAssignDialog, setOpenAssignDialog] = useState(false);
  const [tripData, setTripData] = useState([]);

  const dispatch = useDispatch();

  const sendStatus = async (status) => {
    // console.log("2", sourceData2?.data?.[0]?.documentStatus);
    handleClose();
    if (status === "Verified") {
      const data = {
        id: sourceData?.[0]?.customerdata?.[0]?._id,
        status: "Verified",
        email: sourceData?.[0]?.customerdata?.[0]?.email,
        tripId: sourceData?.[0]?._id,
      };
      try {
        await instance
          .post(SEND_STATUS, data)
          .then((response) => {
            setSourceData2(response.data.data);

            dispatch(
              toastMessage({
                message: "Document Verified successfully!",
                toastStatus: true,
                type: "success",
              })
            );
            handleClose();
          })
          .catch((err) => {
            console.log(err);
            dispatch(
              toastMessage({
                message: "Sorry, something went wrong",
                toastStatus: true,
                type: "error",
              })
            );
          });

        loadData();
      } catch (error) {
        loadData();
        console.log(error);
      }
    } else {
      const data = {
        id: sourceData[0].customerdata[0]._id,
        status: "Rejected",
        email: sourceData[0].customerdata[0].email,
        tripId: sourceData[0]._id,
      };
      try {
        await instance
          .post(SEND_STATUS, data)
          .then((response) => {
            setSourceData2(response.data.data);

            handleClose();
            dispatch(
              toastMessage({
                message: "Document Rejected",
                toastStatus: true,
                type: "info",
              })
            );
          })
          .catch((err) => {
            dispatch(
              toastMessage({
                message: "Sorry, something went wrong",
                toastStatus: true,
                type: "error",
              })
            );
          });
        loadData();
      } catch (error) {
        loadData();
      }
    }
  };
  const cancelAction = async () => {
    const data = {
      cancelationAmount:
        parseFloat(tripData.totalAmount) -
        parseFloat(tripData.totalAmount) * 0.1,
      paymentReference: tripData.paymentReference,
      id: params.id,
      email: sourceData[0].customerdata[0].email,
      paymentMode: tripData.paymentMode,
      status: "Rejected",
    };

    try {
      await instance
        .post(CANCEL_TRIP, data)
        .then((response) => {
          dispatch(
            toastMessage({
              message: "Trip cancelled successfully",
              toastStatus: true,
              type: "success",
            })
          );
          Navigate("/trips");
        })
        .catch((err) => {
          toastMessage({
            message: "Sorry something went wrong!",
            toastStatus: true,
            type: "error",
          });
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const openModalAction = (res) => {
    handleOpen();
    setModalData([res]);
  };

  const varifyContent = (res) => {
    console.log(res);
    const data = {
      _id: modalData._id,
      tripStatus: "Agreement Varified",
    };

    instance
      .post(VARIFY_TRIP, data)
      .then((response) => {
        handleClose();

        Navigate("/trips"); // Assuming `Navigate` is a function you've defined
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  // const handleDownload = useReactToPrint({
  //   content: () => componentRef,
  //   print: async (printIframe) => {
  //     // Do whatever you want here, including asynchronous work
  //     await generateAndSavePDF(printIframe);
  //   },
  // });

  const downloadPdf = () => {
    const rootElementId = "rootElementId";
    const input = document.getElementById(rootElementId);
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF();
      pdf.addImage(imgData, "JPEG", 0, 1);
      pdf.save("Agreement.pdf");
    });
  };

  return (
    <>
      <Breadcrumbs aria-label="breadcrumb" className=" mb-4">
        <Link
          underline="hover"
          color="inherit"
          to="/"
          className="breadcrumpItem"
        >
          Home
        </Link>
        <Link
          underline="hover"
          color="inherit"
          to="/trips"
          className="breadcrumpItem"
        >
          Trips
        </Link>
        <Link color="text.primary" className="breadcrumpItem">
          Trip # {sourceData[0]?.tripNo}
        </Link>
      </Breadcrumbs>
      <div>
        <strong className="text-secondary">Customer Details</strong>
        <table className="w-100">
          <tr>
            <td>Customer Name</td>
            <th>: {sourceData[0]?.customerdata[0].fullName}</th>

            <td>Agreement</td>
            <th>
              <div className="w-100">
                {sourceData?.map((res, i) => (
                  <LoadingButton
                    key={i}
                    variant="contained"
                    onClick={() => {
                      openModalAction(res);
                    }}
                  >
                    View Agreement
                  </LoadingButton>
                ))}
              </div>
            </th>
          </tr>
          <tr>
            {console.log(sourceData)}
            <td>Customer Email</td>
            <th>: {sourceData[0]?.customerdata[0].email}</th>
          </tr>
          <tr>
            <td>Customer Contact no</td>
            <th>: {sourceData[0]?.customerdata[0].contact_no}</th>
          </tr>
          <tr>
            <td>Address</td>
            <th>
              : {sourceData[0]?.customerdata[0]?.addressLine1}
              <br />
              {sourceData[0]?.customerdata[0]?.addressLine2}
              <br />
              {sourceData[0]?.customerdata[0]?.addressLine3}
              <br />
              {sourceData[0]?.customerdata[0]?.zipCode}
              <br />
            </th>
          </tr>
        </table>
      </div>
      <hr />
      {sourceData?.map((res, i) => {
        return (
          <div key={i}>
            <strong className="text-secondary">
              Trip Information - {res?.tripNo}
            </strong>
            <div className="row mt-3">
              <div className="col-12 col-md-6 row">
                <div className="col-5">Source</div>
                <div className="col-7">
                  <strong>: {res?.source}</strong>
                </div>
              </div>
              <div className="col-12 col-md-6 row">
                <div className="col-5">Destination</div>
                <div className="col-7">
                  <strong>: {res?.destination}</strong>
                </div>
              </div>
            </div>

            {res?.rideType === "hourly-trip" ? (
              <div className="row mt-3">
                <div className="col-12 col-md-6 row">
                  <div className="col-5">Time</div>
                  <div className="col-7">
                    <strong>
                      : {parseFloat(res.totalKms).toFixed(2)} Miles
                    </strong>
                  </div>
                </div>
              </div>
            ) : (
              <div className="row mt-3">
                <div className="col-12 col-md-6 row">
                  <div className="col-5">Distance</div>
                  <div className="col-7">
                    <strong>
                      : {parseFloat(res?.totalKms).toFixed(2)} Miles
                    </strong>
                  </div>
                </div>
              </div>
            )}

            <div className="row mt-3">
              <div className="col-12 col-md-6 row">
                <div className="col-5">Cost</div>
                <div className="col-7">
                  <strong>: $ {res?.totalAmount}</strong>
                </div>
              </div>
              <div className="col-12 col-md-6 row">
                <div className="col-5">Created at</div>
                <div className="col-7">
                  <strong>
                    : {moment(res?.created_at).format("DD-MM-YYYY, hh:hh a")}
                  </strong>
                </div>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-12 col-md-6 row">
                <div className="col-5">Schedule Date</div>
                <div className="col-7">
                  <strong>: {res?.scheduledDate} </strong>
                </div>
              </div>
              <div className="col-12 col-md-6 row">
                <div className="col-5">Schedule Time</div>
                <div className="col-7">
                  <strong>: {res?.scheduledTime}</strong>
                </div>
              </div>
            </div>
            {/* <div className='row mt-3'>
                    <div className='col-2'>Passenger</div>
                    <div className='col-4'><strong>: 10</strong></div>
                    <div className='col-2'>Bags</div>
                    <div className='col-4'><strong>: 1</strong></div>
                </div> */}
            <div className="row mt-3">
              <div className="col-12 col-md-6 row">
                <div className="col-5">Ride Type</div>
                <div className="col-7">
                  <strong>
                    :{" "}
                    {res?.rideType === "hourly-trip"
                      ? "Hourly Trip"
                      : res?.rideType === "round-trip"
                      ? "Round Trip"
                      : "One way trip"}
                  </strong>
                </div>
              </div>
              <div className="col-12 col-md-6 row">
                <div className="col-5">Status</div>
                <div className="col-7">
                  <strong>: {res?.tripStatus}</strong>
                </div>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-12 col-md-6 row">
                <div className="col-5">Ride Status</div>
                <div className="col-7">
                  <strong>: Confirmed</strong>
                </div>
              </div>
              <div className="col-12 col-md-6 row">
                <div className="col-5">No of bags</div>
                <div className="col-7">
                  <strong>
                    : {res?.carryOnBagsCount} Carry bag, {res?.checkedBagCount}{" "}
                    Checkin bag
                  </strong>
                </div>
              </div>
              {/* <div className="col-12 col-md-6 row">
                <div className="col-5">Agreement</div>
                <div className="col-7">
                  <LoadingButton
                    variant="contained"
                    onClick={() => {
                      openModalAction(res);
                    }}
                  >
                    View Agreement
                  </LoadingButton>
                </div>
              </div> */}
              {/* <div className="col-4">
                 <select
                  className="form-select"
                  onChange={(e) => setDriverId(e.target.value)}
                >
                  <option selected hidden>
                    Select Driver
                  </option>
                  {driverList.map((rey, y) => (
                    <option key={y} value={rey._id}>
                      {rey.firstName}
                    </option>
                  ))}
                </select> 
              </div> */}
            </div>
            <div className="row mt-3">
              <div className="col-12 col-md-6 row">
                <div className="col-5">and greet</div>
                <div className="col-7">
                  {/* <strong>: {res?.shortDescription}</strong> */}
                  <strong>: {sourceData[0]?.meetAndGreet}</strong>
                </div>
                Meet
              </div>
              <div className="col-12 col-md-6 row">
                <div className="col-5">Car Seat</div>
                <div className="col-7">
                  <div></div>
                  <ul style={{ listStyleType: "circle" }}>
                    {sourceData[0]?.seatCount.map((resxxx, ixxx) => (
                      <li key={ixxx} className="d-flex justify-content-between">
                        <div>{resxxx.type}</div>
                        <div>{resxxx.count}</div>
                      </li>
                    ))}
                  </ul>
                  {/* <strong>: {res?.shortDescription}</strong> */}
                  {/* <strong>: {sourceData[0]?.seatCount[0]}</strong> */}
                </div>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-12 col-md-6 row">
                <div className="col-5">Customer Remarks</div>
                <div className="col-7">
                  <strong>: {sourceData[0]?.shortDescription}</strong>
                </div>
              </div>
              <div className="col-12 col-md-6 row">
                <div className="col-5">Need Wheel Chair</div>
                <div className="col-7">
                  <strong>: {sourceData[0]?.wheelChair}</strong>
                </div>
              </div>
              <div className="col-12 col-md-6 row">
                <div className="col-5">Flight Info</div>
                <div className="col-7">
                  <strong>: {sourceData[0]?.flightInformation}</strong>
                </div>
              </div>
              <div className="col-12 col-md-6 row">
                <div className="col-5">Trip Occassion</div>
                <div className="col-7">
                  <strong>: {sourceData[0]?.tripOccasion}</strong>
                </div>
              </div>
            </div>
            <hr />
            <div className="mt-4">
              <strong className="text-secondary">Vehicle Details</strong>
            </div>
            <div className="row">
              <div
                className="col-12 col-md-6 d-flex"
                style={{ overflow: "auto" }}
              >
                {res?.vehicles[0]?.images?.map((resx, ix) => (
                  <img
                    src={IMAGE_BASE_URL + resx}
                    alt=""
                    style={previewCar}
                    key={ix}
                    className="me-1"
                  />
                ))}
              </div>
              <div className="col-12 col-md-6 d-flex flex-column gap-3">
                <span className="form-control row d-flex">
                  {" "}
                  <div className="col-4">Vehicle Name</div>
                  <div className="col-8"> : {res.vehicles[0].vehicleName}</div>
                </span>
                <span className="form-control row d-flex">
                  {" "}
                  <div className="col-4">Vehicle Licence</div>
                  <div className="col-8"> : {res.vehicles[0].vehicleNo}</div>
                </span>
                <span className="form-control row d-flex">
                  {" "}
                  <div className="col-4">Status</div>
                  <div className="col-8"> : {res.vehicles[0].status}</div>
                </span>
              </div>
            </div>
            <div className="mt-4 d-flex gap-3">
              <Button
                variant="contained"
                color="error"
                onClick={() => {
                  setTripData(res);
                  setOpenDeleteDialog(true);
                }}
              >
                Cancel Trip
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={() => setOpenAssignDialog(true)}
              >
                Assign Driver
              </Button>
            </div>
            {/* <div className='mt-4'>
                    <strong className='text-secondary'>Payment Information</strong>
                    </div>
                Your apps

                <div className='row mt-3'>
                <div className='col-2'>Total Cost</div>
                <div className='col-4'><strong>: Rs. {res.totalAmount}</strong></div>
                <div className='col-2'>Gratuti Amount</div>
                <div className='col-4'><strong>: Rs. {res.totalAmount * 20 / 100}</strong></div>
                </div>
                <div className='row mt-3'>
                    <div className='col-2'>Method</div>
                    <div className='col-4'><strong>: No</strong></div>
                    <div className='col-2'>Cost to company</div>
                    <div className='col-4'><strong>: Rs. {res.totalAmount - res.totalAmount * 20 / 100}</strong></div>
                    </div>
                    <div className='row mt-3'>
                    <div className='col-2'>Method</div>
                    <div className='col-4'><strong>: Online</strong></div>
                    <div className='col-2'>Payment Reference</div>
                    <div className='col-4'><strong>: {res.paymentReference}</strong></div>
                </div> */}
            {/* <div className='text-center mt-4'>
                    <LoadingButton loading={updateDriverLoader} onClick={() => updateDriverData(res)} variant='contained'>Update</LoadingButton >
                </div> */}
          </div>
        );
      })}
      <Modal
        open={openDeleteDialog}
        onClose={() => {
          setOpenDeleteDialog(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            overflow: "auto",
          }}
        >
          <h3>Cancel Booking</h3>
          <p>Are you sure want to cancel the booking?</p>
          <div className="d-flex justify-content-center gap-4">
            <Button
              variant="contained"
              onClick={() => setOpenDeleteDialog(false)}
            >
              No
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={() => cancelAction()}
            >
              Yes
            </Button>
          </div>
        </Box>
      </Modal>
      <Modal
        open={openAssignDialog}
        onClose={() => {
          setOpenAssignDialog(false);
        }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            overflow: "auto",
          }}
        >
          <h5>Assign Driver</h5>
          <select
            className="form-select"
            style={{ width: "260px" }}
            onChange={(e) => setDriverId(e.target.value)}
          >
            <option selected hidden>
              Select Driver
            </option>
            {driverList?.map((rey, y) => (
              <option key={y} value={rey._id}>
                {rey.firstName}
              </option>
            ))}
          </select>
          <div className="text-center mt-4">
            <LoadingButton
              loading={updateDriverLoader}
              onClick={() => {
                updateDriverData();
                setOpenAssignDialog(false);
              }}
              variant="contained"
            >
              Assign
            </LoadingButton>
          </div>
          <div className="d-flex justify-content-center gap-4"></div>
        </Box>
      </Modal>
      <Modal
        open={open}
        sx={{ zIndex: 99999999999 }}
        center
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box
          sx={{
            width: "90vw",
            height: "90vh",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            overflow: "auto",
          }}
        >
          <div ref={componentRef}>
            <AgreementComponent data={modalData} />
          </div>
          {/* {console.log("Modal Data", modalData)} */}
          <div className="d-flex justify-content-center gap-4">
            {console.log("MODAL DATA", modalData)}
            {modalData[0]?.customerdata[0]?.documentStatus === "Verified" ? (
              <Button
                variant="contained"
                color="error"
                onClick={() => sendStatus("Rejected")}
              >
                Reject
              </Button>
            ) : null}
            {modalData[0]?.customerdata[0]?.documentStatus === "Rejected" ||
            modalData[0]?.customerdata[0]?.documentStatus === "" ? (
              <Button
                variant="contained"
                color="success"
                onClick={() => sendStatus("Verified")}
              >
                Verify
              </Button>
            ) : null}

            {/* {modalData[0]?.customerdata[0]?.documentStatus !== "Verified" ? (
              <div className="d-flex justify-content-center gap-4">
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => sendStatus("Verified")}
                >
                  Verify
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => sendStatus("Rejected")}
                >
                  Reject
                </Button>
              </div>
            ) : null} */}
            <Button variant="contained" onClick={handleClose}>
              Cancel
            </Button>
            {/* <Button
              variant="contained"
              color="success"
              onClick={() => varifyContent(modalData)}
            >
              Verify & Send Payment
            </Button> */}
            {/* <Button
              variant="contained"
              color="success"
              onClick={() => varifyContent(modalData)}
            >
              Verify & Send Payment
            </Button> */}
            <Button
              onClick={handlePrint}
              variant="contained"
              startIcon={<FaPrint />}
            >
              Print
            </Button>
            <style>
              {`
          @media print {
            body {
              margin: 2cm; /* You can adjust the margin value according to your preference */
            }
          }
        `}
            </style>
            {/* <Button onClick={handleDownload}>Download</Button> */}
          </div>
        </Box>
      </Modal>
    </>
  );
}

export default UpdateTrip;
