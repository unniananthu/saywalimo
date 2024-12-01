import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { instance } from "../../Const/ApiHeader";
import {
  GET_DRIVERS_LIST,
  GET_SINGLE_TRIP_DATA,
  IMAGE_BASE_URL,
  UPDATE_TRIP_DRIVER,
  VARIFY_TRIP,
} from "../../Const/ApiConst";
import moment from "moment";
import { Button } from "@mui/material";
import { useDispatch } from "react-redux";

function ViewTrip() {
  const previewCar = {
    height: "150px",
  };
  const params = useParams();
  const [sourceData, setSourceData] = useState([]);
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
        .catch((err) => {});
    } catch (error) {}
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

  const updateDriverData = async (res) => {
    setUpdateDriverLoader(true);
    const data = {
      driverId: driverId,
      tripId: params.id,
      tripNo: res.tripNo,
    };
    await instance.post(UPDATE_TRIP_DRIVER, data).then((response) => {
      setUpdateDriverLoader(false);
      Navigate("/trips");
    });
  };

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [modalData, setModalData] = useState([]);

  const openModalAction = (res) => {
    handleOpen();
    setModalData(res);
  };

  const varifyContent = (res) => {
    const data = {
      _id: modalData._id,
      tripStatus: "Agreement Varified",
    };

    instance
      .post(VARIFY_TRIP, data)
      .then((response) => {
        Navigate("/trips"); // Assuming `Navigate` is a function you've defined
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const dispatch = useDispatch();

  return (
    <>
      {sourceData.map((res, i) => {
        return (
          <div key={i}>
            <strong className="text-secondary">
              Trip Information - {res.tripNo}
            </strong>
            <div className="row mt-3">
              <div className="col-2">Source</div>
              <div className="col-4">
                <strong>: {res.source}</strong>
              </div>
              <div className="col-2">Destination</div>
              <div className="col-4">
                <strong>: {res.destination}</strong>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-2">Distance</div>
              <div className="col-4">
                <strong>: 40 KMs</strong>
              </div>
              <div className="col-2">Time</div>
              <div className="col-4">
                <strong>: 2 Hours</strong>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-2">Cost</div>
              <div className="col-4">
                <strong>: {res.totalAmount}</strong>
              </div>
              <div className="col-2">Created at</div>
              <div className="col-4">
                <strong>
                  : {moment(res.created_at).format("DD-MM-YYYY, hh:hh a")}
                </strong>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-2">Schedule Date</div>
              <div className="col-4">
                <strong>
                  : {moment(res.scheduledDate).format("DD/MM/YYYY")}
                </strong>
              </div>
              <div className="col-2">Schedule Time</div>
              <div className="col-4">
                <strong>
                  :{" "}
                  {moment
                    .utc()
                    .startOf("day")
                    .add(moment.duration(res.scheduledTime))
                    .format("hh:mm a")}
                </strong>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-2">Ride Type</div>
              <div className="col-4">
                <strong>: Distance Trip</strong>
              </div>
              <div className="col-2">Status</div>
              <div className="col-4">
                <strong>: {res.tripStatus}</strong>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-2">Ride Status</div>
              <div className="col-4">
                <strong>: Confirmed</strong>
              </div>
              <div className="col-2">Assign Driver</div>
              <div className="col-4">
                {" "}
                <b> : </b>
                <select
                  style={{
                    marginLeft: "5px",
                    border: "1px solid #d6d6d6",
                    padding: "5px 10px",
                    borderRadius: "5px",
                  }}
                  onChange={(e) => setDriverId(e.target.value)}
                >
                  <option hidden>Select Driver</option>
                  {driverList.map((res, i) => (
                    <option value={res._id}>
                      {res.firstName}
                      {res.lastName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-2">Ride Status</div>
              <div className="col-4">
                <strong>: Confirmed</strong>
              </div>
              <div className="col-2">Action</div>
              <div className="col-4">
                {" "}
                <b> : </b>
                <select
                  style={{
                    marginLeft: "5px",
                    border: "1px solid #d6d6d6",
                    padding: "5px 10px",
                    borderRadius: "5px",
                  }}
                >
                  <option hidden>Change Status</option>
                  <option>Vehicle Assigned</option>
                  <option>PIckup Started</option>
                </select>
              </div>
            </div>
            <div className="row mt-3">
              <div className="col-2">Additional Info</div>
              <div className="col-10">
                <strong>: {res.shortDescription}</strong>
              </div>
            </div>

            <div className="mt-4">
              <strong className="text-secondary">Vehicle Details</strong>
            </div>
            <div className="row">
              <div className="col-6 d-flex" style={{ overflow: "auto" }}>
                {res.vehicles[0].images.map((resx, ix) => (
                  <img
                    src={IMAGE_BASE_URL + resx}
                    alt=""
                    style={previewCar}
                    key={ix}
                    className="me-1"
                  />
                ))}
              </div>
              <div className="col-6 d-flex flex-column gap-3">
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
            <div className="text-center mt-4">
              <Button variant="contained" onClick={() => updateDriverData(res)}>
                Update
              </Button>
            </div>
          </div>
        );
      })}
    </>
  );
}

export default ViewTrip;
