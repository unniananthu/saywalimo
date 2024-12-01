import React, { useEffect, useState } from "react";
import {
  UNASSIGNEDTRIPS,
  UPDATE_STATUS,
  SEND_PAYMENT,
  UNASSIGNED_TRIPS_NEW_URL,
} from "../Const/ApiConst";
import { instance } from "../Const/ApiHeader";
import { Badge, Form } from "react-bootstrap";
import "./LoaderAnn.css";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import { Tooltip } from "@mui/material";
import { useDispatch } from "react-redux";
import { toastMessage } from "../store/toast";
import { ToastContainer, toast } from "react-toastify";
import { Empty } from "antd";
import { LoadingButton } from "@mui/lab";

function FilteredTableComponent(params) {
  const [perPageCount, setPerPageCount] = useState(10);

  const checkNight = (value) => {
    switch (value) {
      case "12:00 AM":
        return "Night";

        break;
      case "12:15 AM":
        return "Night";

        break;
      case "12:30 AM":
        return "Night";

        break;
      case "12:45 AM":
        return "Night";

        break;
      case "1:00 AM":
        return "Night";

        break;
      case "1:15 AM":
        return "Night";

        break;
      case "1:30 AM":
        return "Night";

        break;
      case "1:45 AM":
        return "Night";

        break;
      case "2:00 AM":
        return "Night";

        break;
      case "2:15 AM":
        return "Night";

        break;
      case "2:30 AM":
        return "Night";

        break;
      case "2:45 AM":
        return "Night";

        break;
      case "3:00 AM":
        return "Night";

        break;
      case "3:15 AM":
        return "Night";

        break;
      case "3:30 AM":
        return "Night";

        break;
      case "3:45 AM":
        return "Night";

        break;
      case "4:00 AM":
        return "Night";

        break;
      case "4:15 AM":
        return "Night";

        break;
      case "4:30 AM":
        return "Night";

        break;
      case "4:45 AM":
        return "Night";

        break;
      case "5:00 AM":
        return "Night";

        break;
      case "5:15 AM":
        return "Night";

        break;
      case "5:30 AM":
        return "Night";

        break;
      case "5:45 AM":
        return "Night";

        break;
      case "6:00 AM":
        return "Night";

        break;
      case "6:15 AM":
        return "Night";

        break;
      case "6:30 AM":
        return "Night";

        break;
      case "6:45 AM":
        return "Night";

        break;
      case "7:00 AM":
        return "Day";

        break;
      case "7:15 AM":
        return "Day";

        break;
      case "7:30 AM":
        return "Day";

        break;
      case "7:45 AM":
        return "Day";

        break;
      case "8:00 AM":
        return "Day";

        break;
      case "8:15 AM":
        return "Day";

        break;
      case "8:30 AM":
        return "Day";

        break;
      case "8:45 AM":
        return "Day";

        break;
      case "9:00 AM":
        return "Day";

        break;
      case "9:15 AM":
        return "Day";

        break;
      case "9:30 AM":
        return "Day";

        break;
      case "9:45 AM":
        return "Day";

        break;
      case "10:00 AM":
        return "Day";

        break;
      case "10:15 AM":
        return "Day";

        break;
      case "10:30 AM":
        return "Day";

        break;
      case "10:45 AM":
        return "Day";

        break;
      case "11:00 AM":
        return "Day";

        break;
      case "11:15 AM":
        return "Day";

        break;
      case "11:30 AM":
        return "Day";

        break;
      case "11:45 AM":
        return "Day";

        break;
      case "12:00 PM":
        return "Day";

        break;
      case "12:15 PM":
        return "Day";

        break;
      case "12:30 PM":
        return "Day";

        break;
      case "12:45 PM":
        return "Day";

        break;
      case "01:00 PM":
        return "Day";

        break;
      case "01:15 PM":
        return "Day";

        break;
      case "01:30 PM":
        return "Day";

        break;
      case "01:45 PM":
        return "Day";

        break;
      case "02:00 PM":
        return "Day";

        break;
      case "02:15 PM":
        return "Day";

        break;
      case "02:30 PM":
        return "Day";

        break;
      case "02:45 PM":
        return "Day";

        break;
      case "03:00 PM":
        return "Day";

        break;
      case "03:15 PM":
        return "Day";

        break;
      case "03:30 PM":
        return "Day";

        break;
      case "03:45 PM":
        return "Day";

        break;
      case "04:00 PM":
        return "Day";

        break;
      case "04:15 PM":
        return "Day";

        break;
      case "04:30 PM":
        return "Day";

        break;
      case "04:45 PM":
        return "Day";

        break;
      case "05:00 PM":
        return "Day";

        break;
      case "05:15 PM":
        return "Day";

        break;
      case "05:30 PM":
        return "Day";

        break;
      case "05:45 PM":
        return "Day";

        break;
      case "06:00 PM":
        return "Day";

        break;
      case "06:15 PM":
        return "Day";

        break;
      case "06:30 PM":
        return "Day";

        break;
      case "06:45 PM":
        return "Day";

        break;
      case "07:00 PM":
        return "Day";

        break;
      case "07:15 PM":
        return "Day";

        break;
      case "07:30 PM":
        return "Day";

        break;
      case "07:45 PM":
        return "Day";

        break;
      case "08:00 PM":
        return "Day";

        break;
      case "08:15 PM":
        return "Day";

        break;
      case "08:30 PM":
        return "Day";

        break;
      case "08:45 PM":
        return "Day";

        break;
      case "09:00 PM":
        return "Day";

        break;
      case "09:15 PM":
        return "Day";

        break;
      case "09:30 PM":
        return "Day";

        break;
      case "09:45 PM":
        return "Day";

        break;
      case "10:00 PM":
        return "Night";

        break;
      case "10:15 PM":
        return "Night";

        break;
      case "10:30 PM":
        return "Night";

        break;
      case "10:45 PM":
        return "Night";

        break;
      case "11:00 PM":
        return "Night";

        break;
      case "11:15 PM":
        return "Night";

        break;
      case "11:30 PM":
        return "Night";

        break;
      case "11:45 PM":
        return "Night";

        break;
      default:
        break;
    }
  };
  const columns = [
    {
      name: "Trip #",
      selector: (row) => (
        <div style={{ position: "relative" }}>
          {row.tripNo}
          <div>
            {row.tripSource === "Admin" ? (
              <Badge bg="warning"> Admin Trip</Badge>
            ) : (
              <Badge bg="info"> Online Trip</Badge>
            )}
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      name: "Client",
      selector: (row) => (
        <div style={{ position: "relative" }}>
          <div className="mb-1 mt-1">
            {row.totalCustomerTrips <= 1 ? (
              <Badge>New</Badge>
            ) : (
              <Badge bg="success">Returning</Badge>
            )}
          </div>
          <Tooltip
            title={
              row.customerName +
              " - " +
              row.customerdata[0]?.email +
              " - " +
              row.customerdata[0]?.contact_no
            }
          >
            <div className="d-flex flex-column">
              <strong>{row.customerName}</strong>
              <div>{row.customerdata[0]?.email}</div>
              <div>{row.customerdata[0]?.contact_no}</div>
            </div>
          </Tooltip>
        </div>
      ),
      sortable: true,
    },
    {
      name: "Pickup Date & Time",
      selector: (row) => (
        <div>
          <div>
            {row.scheduledDate}
            <br />
            {row.scheduledTime}
          </div>
        </div>
      ),
      sortable: true,
    },
    {
      name: "Location",
      selector: (row) => (
        <Tooltip title={row.source + " - " + row.destination}>
          <span className="d-flex flex-column">
            <span style={{ cursor: "alias", fontWeight: "bold" }}>
              {row.source}
            </span>
            <span>
              {row.stops.length !== 0 ? row.stops.length + " Stops" : ""}
            </span>
            <span style={{ cursor: "alias", fontWeight: "bold" }}>
              {row.destination}
            </span>
          </span>
        </Tooltip>
      ),
      sortable: true,
    },
    // {
    //   name: "Drop off Location",
    //   selector: (row) => (
    //     <Tooltip title={row.destination}>
    //       <span style={{ cursor: "alias" }}>{row.destination}</span>
    //     </Tooltip>
    //   ),
    //   sortable: true,
    // },
    {
      name: "Total Amount",
      selector: (row) => (
        <div className="text-end">
          <div>{"$ " + parseInt(row.totalAmount).toFixed(0)}</div>
          <div>
            {" "}
            {row.discount === 0 ||
            row.discount === "0" ||
            row.discount === null ||
            row.discount === undefined ||
            row.discount === "" ? null : (
              <Badge>Discount Trip</Badge>
            )}
          </div>
        </div>
      ),
      sortable: true,
      style: { display: "flex", justifyContent: "end" },
    },
    {
      name: "Payment Status",
      selector: (row) =>
        row.paymentReference === "" ||
        row?.paymentReference === undefined ||
        row?.paymentReference === null
          ? "Payment Pending"
          : "Payment Completed",
      sortable: true,
    },
    // {S
    //   name: "Document Status",
    //   selector: (row) => (
    //     <Tooltip title={row.documentStatus}>
    //       <span
    //         style={{
    //           cursor: "alias",
    //           fontWeight: "bold",
    //           color:
    //             row?.customerdata[0]?.documentStatus === "Verified"
    //               ? "green"
    //               : row?.customerdata[0]?.documentStatus === "Rejected"
    //               ? "red"
    //               : "blue",
    //         }}
    //       >
    //         {row?.customerdata[0]?.documentStatus}
    //       </span>
    //     </Tooltip>
    //   ),
    //   sortable: true,
    // },
    {
      name: "View",
      selector: (row) => (
        <>
          {buttonTitle === "" ? (
            <div>
              <Button
                style={{
                  color: "green",
                  backgroundColor: "white",
                  fontWeight: "600",
                }}
                size="small"
                variant="contained"
                // onClick={() => updateStatus(row._id)}
              >
                Trip Completed
              </Button>
            </div>
          ) : row.tripStatus == "Pending" ? (
            <div className="d-flex flex-column">
              <Link to={"/trip_action/" + row._id}>
                <Button
                  style={{ background: "#c19b65" }}
                  size="small"
                  variant="contained"
                  // onClick={() => updateStatus(row._id)}
                >
                  {buttonTitle}
                </Button>
              </Link>
            </div>
          ) : (
            <Button
              size="small"
              style={{ background: "#c19b65" }}
              variant="contained"
              onClick={() => {
                updateStatus(row._id);
                dispatch(
                  toastMessage({
                    message: "Status updated successfully!",
                    toastStatus: true,
                    type: "success",
                  })
                );
              }}
            >
              {buttonTitle}
            </Button>
          )}
        </>
      ),
      sortable: true,
    },
    {
      name: "",
      selector: (row) =>
        row.paymentReference === "" ||
        row.paymentReference === undefined ||
        row.paymentReference === null ? (
          <Button
            size="sm"
            variant="contained"
            onClick={() => sendPaymentLink(row)}
          >
            <small>Send Payment Link</small>
          </Button>
        ) : null,
      style: { width: "450px", textAlign: "center" },
    },
  ];

  const sendPaymentLink = async (data) => {
    await instance
      .post(SEND_PAYMENT, data)
      .then((response) => {
        if (response.status === 200) {
          toast.success("Payment link send successfully!", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          // window.location.reload();
        }
      })
      .catch((e) => console.log(e));
  };
  const dispatch = useDispatch();

  const [filteredTripData, setFilteredTripData] = useState([]);

  const [tripDataArray, setTripDataArray] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalRows, setTotalRows] = useState(0);
  const [buttonTitle, setButtonTitle] = useState("");
  const [perPage, setPerPage] = useState(10);
  const [searchKey, setSearchKey] = useState("");
  const [value, setValue] = useState("1");
  const [dddddd, setDddddd] = useState([]);

  const loadData = async (page) => {
    setLoading(true);
    const filter = {
      status: params.data,
      page: page,
      per_page: perPage,
      searchKey: searchKey,
    };
    instance
      .post(UNASSIGNEDTRIPS, filter)
      .then((response) => {
        setTripDataArray(response.data.data);

        // console.log("data:", response.data.data);
        setTotalRows(response.data.total);
        // console.log("total", response.data.total);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  const loadDataNew = (pageCount) => {
    console.log(pageCount);

    setLoading(true);
    const filter = {
      status: params.data,
      searchKey: searchKey,
      per_page: pageCount,
    };
    instance
      .post(UNASSIGNED_TRIPS_NEW_URL, filter)
      .then((response) => {
        setTripDataArray(response.data.data);

        // console.log("data:", response.data.data);
        setTotalRows(response.data.total);
        // console.log("total", response.data.total);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  const handlePageChange = (page) => {
    loadData(page);
    loadDataNew();
  };

  const handlePerRowsChange = async (newPerPage, page) => {
    setLoading(true);
    const data = {
      page: page,
      per_page: newPerPage,
      searchKey: searchKey,
      status: params.data,
    };
    const response = await instance.post(UNASSIGNEDTRIPS, data);
    setTripDataArray(response.data.data);
    setPerPage(newPerPage);
    setLoading(false);
  };

  // useEffect(() => {
  //   loadData("Pending", 2);
  //   // console.log("first", page);
  //   // fetch page 1 of users
  //   // eslint-disable-next-line
  // }, []);

  useEffect(() => {
    loadData(1, params.data);
    loadDataNew(10);
    if (params.data === "Pending") {
      setButtonTitle("View");
    } else if (params.data === "Trip Confirmed") {
      setButtonTitle("Enroute");
    } else if (params.data === "Enroute") {
      setButtonTitle("Arrived");
    } else if (params.data === "Arrived") {
      setButtonTitle("Onboard");
    } else if (params.data === "Onboard") {
      setButtonTitle("Completed");
    } else if (params.data === "Completed") {
      setButtonTitle("");
    } else {
    }
  }, []);

  const updateStatus = async (id) => {
    const data = {
      tripId: id,
      status: buttonTitle,
    };
    await instance.post(UPDATE_STATUS, data);
    loadData(1);
    loadDataNew(perPageCount);
  };

  const liveSearchActionNew = async (e) => {
    setSearchKey(e.target.value);
    // setLoading(true);
    const filter = {
      status: params.data,
      per_page: perPageCount,
      searchKey: e.target.value,
    };
    instance
      .post(UNASSIGNED_TRIPS_NEW_URL, filter)
      .then((response) => {
        setTripDataArray(response.data.data);
        // console.log("data:", response.data.data);
        setTotalRows(response.data.total);
        // console.log("total", response.data.total);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };
  const liveSearchAction = async (e) => {
    setSearchKey(e.target.value);
    setLoading(true);
    const filter = {
      page: 1,
      status: params.data,
      per_page: 10,
      searchKey: e.target.value,
      status: params.data,
    };
    instance
      .post(UNASSIGNEDTRIPS, filter)
      .then((response) => {
        setTripDataArray(response.data.data);
        // console.log("data:", response.data.data);
        setTotalRows(response.data.total);
        // console.log("total", response.data.total);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  return loading ? (
    <div className="d-flex justify-content-center w-100 p-5">
      <div class="loader"></div>
    </div>
  ) : (
    <div>
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

      <div className="col-4">
        {" "}
        <Form.Control
          type="search"
          placeholder="Search..."
          onChange={(e) => liveSearchActionNew(e)}
        />
      </div>
      {/* <DataTable
        responsive={true}
        columns={columns}
        data={tripDataArray}
        progressPending={loading}
        pagination
        paginationServer
        paginationTotalRows={totalRows}
        onChangeRowsPerPage={handlePerRowsChange}
        onChangePage={handlePageChange}
      /> */}
      {tripDataArray.length < 1 && (
        <div className="p-2">
          <Empty />
        </div>
      )}
      {tripDataArray.map((res, i) => (
        <div
          style={{
            margin: "15px 0",
            boxShadow: "rgba(0, 0, 0, 0.35) 0px 5px 15px",
            padding: "10px",
            borderRadius: "10px",
            position: "relative",
          }}
          key={i}
        >
          <div
            style={{
              borderRadius: "10px 0 10px 0 ",
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "start",
              width: "100%+10px",
              margin: "-10px -10px 0 -10px",
            }}
          >
            <div>
              {res.totalCustomerTrips <= 1 ? (
                <small
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "blue",
                    color: "white",
                    borderRadius: "10px 0 10px 0 ",
                  }}
                >
                  New Customer
                </small>
              ) : (
                <small
                  style={{
                    padding: "5px 10px",
                    backgroundColor: "green",
                    color: "white",
                    borderRadius: "10px 0 10px 0 ",
                  }}
                >
                  Returning Customer
                </small>
              )}
            </div>

            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex gap-2 flex-wrap">
                {checkNight(res.scheduledTime) === "Night" && (
                  <Badge bg="info"> Prime Time</Badge>
                )}
                {res.discount === 0 ||
                res.discount === "0" ||
                res.discount === null ||
                res.discount === undefined ||
                res.discount === "" ? null : (
                  <Badge>Discount Trip</Badge>
                )}
                {res.tripSource === "Admin" ? (
                  <Badge bg="warning"> Admin Trip</Badge>
                ) : (
                  <Badge bg="info"> Online Trip</Badge>
                )}
              </div>

              <div className="mx-2">
                {res?.rideType
                  .split("-")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </div>
            </div>
          </div>
          <div className="mt-3 row">
            <div className="col-12 col-md-4">
              <div>
                <span>Trip No : </span>
                <strong>{res.tripNo}</strong>
              </div>
            </div>
            <div className="col-12 col-md-4">
              <div>Pickup Date: </div>
              <div>
                <div>
                  {res.scheduledDate},{res.scheduledTime}
                </div>
              </div>
            </div>
            {res?.rideType === "return-trip" ? null : (
              <div className="col-12 col-md-4">
                <div>Amount: </div>
                <div className="d-flex gap-2 align-items-center">
                  {console.log(res?.rideType === "return-trip")}

                  <strong>{"$ " + parseInt(res.totalAmount).toFixed(0)}</strong>
                  {res.paymentReference === "" ||
                  res?.paymentReference === undefined ||
                  res?.paymentReference === null ? (
                    <small style={{ color: "red" }}> (Payment Pending)</small>
                  ) : (
                    <small style={{ color: "green" }}> (Paid)</small>
                  )}
                </div>
              </div>
            )}
          </div>
          <hr />
          <div className="row">
            <div className="col-12 col-md-5 d-flex flex-column">
              <b>Customer Name</b>
              <small>{res.customerdata[0]?.fullName}, </small>
              <small>{res.customerdata[0]?.email}, </small>
              <small>{res.customerdata[0]?.contact_no}</small>
            </div>
            <div className="col-12 col-md-5 d-flex flex-column">
              <b>Pickup Location</b>
              <span className="d-flex flex-column">
                <small style={{ cursor: "alias" }}>{res.source}</small>
                <small>
                  {res.stops[0] !== "[]" ? res.stops.length + " Stops" : ""}
                </small>
                <small style={{ cursor: "alias" }}>{res.destination}</small>
              </span>
            </div>
            <div className="col-12 col-md-2 pt-2 pb-2 text-center">
              {res.paymentReference === "" ||
              res.paymentReference === undefined ||
              res.paymentReference === null ? (
                <Button
                  size="sm"
                  variant="contained"
                  onClick={() => sendPaymentLink(res)}
                >
                  <small>Send Payment Link</small>
                </Button>
              ) : null}
            </div>
          </div>
          <hr />

          {res?.driver !== undefined ? (
            <div>
              <div>
                Driver :{" "}
                {`${res?.driver[0]?.firstName} ${res?.driver[0]?.lastName}`}
              </div>
              <hr />
            </div>
          ) : null}
          <div className="text-center">
            {buttonTitle === "" ? (
              <Link to={`/view-trip/${res._id}`}>
                <Button
                  style={{
                    color: "green",
                    backgroundColor: "white",
                    fontWeight: "600",
                  }}
                  size="small"
                  variant="contained"
                  // onClick={() => updateStatus(row._id)}
                >
                  View
                </Button>
              </Link>
            ) : res.tripStatus == "Pending" ? (
              <div className="d-flex flex-column">
                <Link to={"/trip_action/" + res._id}>
                  <Button
                    style={{ background: "#c19b65" }}
                    size="small"
                    variant="contained"
                    // onClick={() => updateStatus(row._id)}
                  >
                    {buttonTitle}
                  </Button>
                </Link>
              </div>
            ) : (
              <Button
                size="small"
                style={{ background: "#c19b65" }}
                variant="contained"
                onClick={() => {
                  updateStatus(res._id);
                  dispatch(
                    toastMessage({
                      message: "Status updated successfully!",
                      toastStatus: true,
                      type: "success",
                    })
                  );
                }}
              >
                {buttonTitle}
              </Button>
            )}
          </div>
          <div></div>
        </div>
      ))}
      {/* {tripDataArray.length < 10 && ( */}
      <div className="text-center mt-4">
        <LoadingButton
          onClick={() => {
            loadDataNew(perPageCount + 10);
            setPerPageCount(perPageCount + 10);
          }}
        >
          Load More
        </LoadingButton>
      </div>
      {/* )} */}
    </div>

    // <Table>
    //   <thead>
    //     <tr>
    //       <th>Trip #</th>
    //       <th>Full Name</th>
    //       <th>Pickup Date & Time</th>
    //       <th>Pickup Location</th>
    //       <th>Dropoff Location</th>
    //       <th>Total Amount</th>
    //       <th>Payment Status</th>
    //       <th></th>
    //     </tr>
    //   </thead>
    //   <tbody>
    //     {filteredTripData?.length === 0 ? (
    //       <tr>
    //         <td colSpan={7} className="text-center">
    //           No Data
    //         </td>
    //       </tr>
    //     ) : (
    //       filteredTripData?.map((res, i) => (
    //         <tr key={i} style={{ fontSize: "12px" }}>
    //           <td>{res?.tripNo}</td>
    //           <td>{res?.customerName}</td>
    //           <td>
    //             <div>{res?.scheduledDate}</div>
    //             <div>{res?.scheduledTime}</div>
    //           </td>
    //           <td>{res?.source}</td>
    //           <td>{res?.destination}</td>
    //           <td>$ {res?.totalAmount}</td>
    //           <td>
    //             {res?.paymentReference === "" ||
    //             res?.paymentReference === undefined ||
    //             res?.paymentReference === null
    //               ? "Payment Pending"
    //               : "Payment Completed"}
    //           </td>
    //           <td>
    //             {params.data === "Pending" ? (
    //               <Link to={`/trip_action/${res._id}`}>
    //                 <Button size="small" variant="contained">
    //                   View
    //                 </Button>
    //               </Link>
    //             ) : (
    //               <Button
    //                 size="small"
    //                 variant="contained"
    //                 onClick={() => updateStatus(res._id)}
    //               >
    //                 {buttonTitle}
    //               </Button>
    //             )}
    //           </td>
    //         </tr>
    //       ))
    //     )}
    //   </tbody>
    // </Table>
  );
}

export default FilteredTableComponent;
