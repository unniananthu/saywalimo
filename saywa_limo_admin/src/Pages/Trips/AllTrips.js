import { Breadcrumbs, Paper, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { instance } from "../../Const/ApiHeader";
import {
  ALL_CLIENTS,
  GETUSERS,
  GET_VEHICLE_LIST,
  LIVE_CUSTOMER,
} from "../../Const/ApiConst";
import { useDispatch, useSelector } from "react-redux";
import "./map.css";
import { Link } from "react-router-dom";
import TripCustomerComponent from "../../Components/new_trip_components/TripCustomerComponent";
import { changeTabIndexState } from "../../store/Trips/TripSlice";
import TripContentComponent from "../../Components/new_trip_components/TripContentComponent";
import TripPreviewComponent from "../../Components/new_trip_components/TripPreviewComponent";
import TripPassengerComponent from "../../Components/new_trip_components/TripPassengerComponent";
import TripVehicleSelectionComponent from "../../Components/new_trip_components/TripVehicleSelectionComponent";
import StepperAdmin from "./StepperAdmin";
import TripPackageComponent from "../../Components/new_trip_components/TripPackageComponent";

function AllTrips() {
  const addTripContainerStyle = {
    display: "grid",
    gridTemplateColumns: "auto auto auto",
    gap: "20px",
  };

  const [options, setOptions] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [customerList, setCustomerList] = useState([]);
  const [vehicleList, setVehicleList] = useState([]);
  const [driverList, setDriverList] = useState([]);

  const [SelectedCusid, setSelectedCusid] = useState("");

  const [formData, setFormData] = useState({
    customerId: "",
    vehicleId: "",

    // soure: "",
    // destination: "",

    rideType: "Oneway Trip",
    totalHours: "",
    driverId: "",
    scheduledDate: "",
    scheduledTime: "",
    shortDescription: "",
    tripStatus: "",
    totalAmount: "",
    totalDistance: "",
    tripOcassion: "",
    tripOccasionDetails: "",
    Meet: "Yes",
    stops: [],
    paymentStatus: "",
    paymentReference: "",
    paymentMode: "",
    noOfPassengers: "",
    noOfBags: "",
    bagType: "Checked",
    flightInformation: "",

    needCarSeat: "No",
    seatCount: "",
    additionalInfo: "",
    gratuiryTypeCash: "",
    gratuityAmount: "",
  });

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await instance.post(ALL_CLIENTS, {
          searchKey: inputValue,
        });
        setOptions(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (inputValue !== "") {
      fetchData();
    } else {
      setOptions([]);
    }
  }, [inputValue]);

  useEffect(() => {
    loadCustomerData();
    loadVehicles();
    loadDriver();
  }, []);

  const loadCustomerData = async () => {
    const customers_list = await instance.post(ALL_CLIENTS);
    setCustomerList(customers_list?.data?.data);
  };

  const loadVehicles = async () => {
    const vehicle_list = await instance.post(GET_VEHICLE_LIST);
    setVehicleList(vehicle_list?.data?.data);
  };

  const loadDriver = async () => {
    const vehicle_list = await instance.post(GETUSERS);
    setDriverList(vehicle_list?.data?.data);
  };

  const { tabIndexState } = useSelector((state) => state?.trips);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(changeTabIndexState(0));
  }, []);
  return (
    <div>
      <Breadcrumbs aria-label="breadcrumb">
        <Link
          underline="hover"
          color="inherit"
          to="/"
          className="breadcrumpItem"
        >
          Home
        </Link>
        <Link color="text.primary" className="breadcrumpItem">
          New Trip
        </Link>
      </Breadcrumbs>
      <Paper sx={{ p: 2 }} className="mt-2">
        <div>
          <div>
            <StepperAdmin />
            <hr></hr>
          </div>
          {tabIndexState !== 0 ? (
            <Button
              size="small"
              type="primary"
              style={{ background: "grey", border: "none" }}
              onClick={() => dispatch(changeTabIndexState(tabIndexState - 1))}
            >
              Back
            </Button>
          ) : null}
          <div className="mt-2">
            {tabIndexState === 0 ? (
              <TripCustomerComponent />
            ) : tabIndexState === 1 ? (
              <TripContentComponent />
            ) : tabIndexState === 2 ? (
              <TripVehicleSelectionComponent />
            ) : tabIndexState === 3 ? (
              <TripPassengerComponent />
            ) : tabIndexState === 4 ? (
              <TripPreviewComponent />
            ) : null}
          </div>
        </div>
      </Paper>
    </div>
  );
}

export default AllTrips;
