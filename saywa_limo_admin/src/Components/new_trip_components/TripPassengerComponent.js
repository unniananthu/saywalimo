import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeTabIndexState } from "../../store/Trips/TripSlice";
import { Button, TextField } from "@mui/material";
import { getAllUsers } from "../../store/Users/UserSlice";
import { location } from "../../store/Places/Places";

function TripPassengerComponent() {
  const dispatch = useDispatch();
  const { tabIndexState, tripData } = useSelector((state) => state?.trips);
  const { singleVehicle } = useSelector((state) => state?.vehicle);
  const { customers } = useSelector((state) => state?.users);
  const { selectedCustomer } = useSelector((state) => state?.customer);

  const { locations } = useSelector((state) => state?.places);
  const abc = useSelector((state) => state?.places);
  const [noOfPassengers, setNoOfPassengers] = useState(1);
  const [noOfBags, setNoOfBags] = useState(1);
  const [occcation, setOcccation] = useState("Airport transfer");
  const [driverId, setDriverId] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [meetGreet, setMeetGreet] = useState("Yes");
  const [paymentMode, setPaymentMode] = useState("Online");
  const [tripOccasionDetails, setSetTripOccasionDetails] = useState("");
  const [checkInBags, setCheckInBags] = useState(0);
  const [carryBags, setCarryBags] = useState(0);
  const [gratuityAmount, setGratuityAmount] = useState(20);
  const [flightInfo, setFlightInfo] = useState("");
  const [needCarSeat, setNeedCarSeat] = useState("Yes");
  const [seatCount, setSeatCount] = useState(0);
  const [discount, setDiscount] = useState(0);

  const setGratuity = (e) => {
    if (
      e.target.value === "" ||
      e.target.value === undefined ||
      e.target.value === null
    ) {
      setGratuityAmount(0);
    } else {
      setGratuityAmount(e.target.value);
    }
    // if (e.target.value < 20) {
    //   setGratuityAmount(20);
    // } else {
    //   setGratuityAmount(e.target.value);
    // }
  };

  useEffect(() => {
    dispatch(getAllUsers());
    // console.log("locations:", locations);
  }, []);

  const saveAction = () => {
    const data = {
      ...locations,
      noOfPassengers,
      noOfBags,
      occcation,
      driverId,
      shortDescription,
      meetGreet,
      paymentMode,
      tripOccasionDetails,
      checkInBags,
      carryBags,
      gratuityAmount,
      flightInfo,
      needCarSeat,
      seatCount,
      emailId: selectedCustomer.email,
      discount: discount,
    };

    dispatch(location(data));
    dispatch(changeTabIndexState(tabIndexState + 1));
  };

  return (
    <div>
      <div className="d-flex gap-2 passenger-component">
        <div className="w-100">
          <small>Number of Passengers</small>
          <select
            className="form-select"
            onChange={(e) => setNoOfPassengers(e.target.value)}
          >
            {Array.from(
              { length: parseInt(singleVehicle.maxPersons) },
              (_, index) => (
                <option key={index + 1} value={index + 1}>
                  {index + 1}
                </option>
              )
            )}
          </select>
        </div>
        <div className="w-100">
          <small>Number of Bags</small>
          <select
            className="form-select"
            onChange={(e) => setNoOfBags(e.target.value)}
          >
            {Array.from(
              { length: parseInt(singleVehicle.maxBags) },
              (_, index) => (
                <option key={index + 1} value={index + 1}>
                  {index + 1}
                </option>
              )
            )}
          </select>
        </div>
        <div className="w-100  passenger-component">
          <div className="w-100">
            <small>Carry Bags </small>
            <select
              className="form-select"
              onChange={(e) => setCarryBags(e.target.value)}
            >
              {noOfBags - checkInBags === 0 ? (
                <option>0</option>
              ) : (
                Array.from(
                  { length: noOfBags - checkInBags + 1 },
                  (_, index) => <option key={index}>{index}</option>
                )
              )}
            </select>
          </div>
          <div className="w-100">
            <small>Checkin Bags</small>
            <select
              className="form-select"
              onChange={(e) => setCheckInBags(e.target.value)}
            >
              {noOfBags - carryBags === 0 ? (
                <option>0</option>
              ) : (
                Array.from({ length: noOfBags - carryBags + 1 }, (_, index) => (
                  <option key={index}>{index}</option>
                ))
              )}
            </select>
          </div>{" "}
        </div>
      </div>
      <div className=" passenger-component mt-2">
        <div className="w-100">
          <small>Flight Information</small>
          <input
            type="text"
            placeholder="Flight Info"
            className="form-control"
            onChange={(e) => setFlightInfo(e.target.value)}
          />
        </div>
        <div className="w-100">
          <small>Trip Occasion(s)</small>
          <select
            className="form-select"
            onChange={(e) => setOcccation(e.target.value)}
          >
            <option>Airport Transfer</option>
            <option>Wedding</option>
            <option>Quinceanera/Birthday</option>
            <option>Homecoming/Prom</option>
            <option>Other</option>
          </select>
        </div>
        {occcation === "Other" ? (
          <div className="w-100">
            <small>Ocassions Details</small>
            <input
              type="text"
              placeholder="Occassion Details"
              className="form-control"
              onChange={(e) => setSetTripOccasionDetails(e.target.value)}
            />
          </div>
        ) : null}
        <div className="w-100">
          <small>Driver</small>
          <select
            className="form-select"
            onChange={(e) => setDriverId(e.target.value)}
          >
            <option>Select Later</option>
            {customers.map((res, i) => (
              <option value={res._id} key={i}>
                {res.firstName} {res.lastName}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="d-flex gap-2 mt-3">
        <div className="w-100">
          <small>Additional Info</small>
          <textarea
            className="form-control"
            onChange={(e) => setShortDescription(e.target.value)}
          ></textarea>
        </div>
      </div>
      <div className=" passenger-component mt-3">
        <div className="w-100">
          <small>Need car seat?</small>
          <select
            className="form-select"
            onChange={(e) => setNeedCarSeat(e.target.value)}
          >
            <option>Yes</option>
            <option>No</option>
          </select>
        </div>
        <div className="w-100">
          <small>Car Seat count</small>
          <input
            type="number"
            value={seatCount}
            onChange={(e) => setSeatCount(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="w-100">
          <small>Gratuity (%)</small>
          <input
            type="number"
            value={gratuityAmount}
            onChange={(e) => setGratuityAmount(e.target.value)}
            onBlur={(e) => setGratuity(e)}
            className="form-control"
          />
        </div>
        <div className="w-100">
          <small>Discount ($)</small>
          <input
            type="number"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            onBlur={(e) => {
              if (
                e.target.value === "" ||
                e.target.value === undefined ||
                e.target.value === null
              ) {
                setDiscount(0);
              } else {
                setDiscount(parseFloat(e.target.value));
              }
            }}
            className="form-control"
          />
        </div>
        <div className="w-100">
          <small>Meet & Greet</small>
          <select
            className="form-select"
            value={meetGreet}
            onChange={(e) => setMeetGreet(e.target.value)}
          >
            <option>Yes</option>
            <option>No</option>
          </select>
        </div>
        <div className="w-100">
          <small>Payment Mode</small>
          <select
            className="form-select"
            value={paymentMode}
            onChange={(e) => setPaymentMode(e.target.value)}
          >
            <option>Cash</option>
            <option>Online</option>
          </select>
        </div>
      </div>
      <div className="text-end mt-2">
        <Button size="small" variant="contained" onClick={() => saveAction()}>
          Proceed
        </Button>
      </div>
    </div>
  );
}

export default TripPassengerComponent;
