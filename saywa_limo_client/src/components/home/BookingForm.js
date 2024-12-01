import React, { useEffect, useRef, useState } from "react";
import "./bookingform.css";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";
import { useDispatch } from "react-redux";
import { location } from "../../store/Places";
import { useNavigate } from "react-router-dom";
import DraggableWaypoints from "./DraggableWaypoints";
import { wayPoints } from "../../store/WaypointSlice";
import { useSelector } from "react-redux";
import moment from "moment/moment";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { activeStepx } from "../../store/StepperSlice";
import { toast, ToastContainer } from "react-toastify";
import DateTimePicker from "./DateTimePicker";

// ----------------------------------[Configurations]----------------------------------
const timings = [
  "12:00 AM",
  "12:15 AM",
  "12:30 AM",
  "12:45 AM",
  "01:00 AM",
  "01:15 AM",
  "01:30 AM",
  "01:45 AM",
  "02:00 AM",
  "02:15 AM",
  "02:30 AM",
  "02:45 AM",
  "03:00 AM",
  "03:15 AM",
  "03:30 AM",
  "03:45 AM",
  "04:00 AM",
  "04:15 AM",
  "04:30 AM",
  "04:45 AM",
  "05:00 AM",
  "05:15 AM",
  "05:30 AM",
  "05:45 AM",
  "06:00 AM",
  "06:15 AM",
  "06:30 AM",
  "06:45 AM",
  "07:00 AM",
  "07:15 AM",
  "07:30 AM",
  "07:45 AM",
  "08:00 AM",
  "08:15 AM",
  "08:30 AM",
  "08:45 AM",
  "09:00 AM",
  "09:15 AM",
  "09:30 AM",
  "09:45 AM",
  "10:00 AM",
  "10:15 AM",
  "10:30 AM",
  "10:45 AM",
  "11:00 AM",
  "11:15 AM",
  "11:30 AM",
  "11:45 AM",
  "12:00 PM",
  "12:15 PM",
  "12:30 PM",
  "12:45 PM",
  "01:00 PM",
  "01:15 PM",
  "01:30 PM",
  "01:45 PM",
  "02:00 PM",
  "02:15 PM",
  "02:30 PM",
  "02:45 PM",
  "03:00 PM",
  "03:15 PM",
  "03:30 PM",
  "03:45 PM",
  "04:00 PM",
  "04:15 PM",
  "04:30 PM",
  "04:45 PM",
  "05:00 PM",
  "05:15 PM",
  "05:30 PM",
  "05:45 PM",
  "06:00 PM",
  "06:15 PM",
  "06:30 PM",
  "06:45 PM",
  "07:00 PM",
  "07:15 PM",
  "07:30 PM",
  "07:45 PM",
  "08:00 PM",
  "08:15 PM",
  "08:30 PM",
  "08:45 PM",
  "09:00 PM",
  "09:15 PM",
  "09:30 PM",
  "09:45 PM",
  "10:00 PM",
  "10:15 PM",
  "10:30 PM",
  "10:45 PM",
  "11:00 PM",
  "11:15 PM",
  "11:30 PM",
  "11:45 PM",
];

dayjs.extend(customParseFormat);
const dateFormat = "MM-DD-YYYY";
const libraries = ["places"];
const today = new Date();
const formattedDatexxx = `${today.getDate().toString().padStart(2, "0")}-${(
  today.getMonth() + 1
)
  .toString()
  .padStart(2, "0")}-${today.getFullYear()}`;
// ----------------------------------[Custom Styles]----------------------------------

function BookingForm() {
  // ----------------------------------[Load Map]----------------------------------
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });

  // ----------------------------------[States]----------------------------------

  const [pickUPLocationError, setPickUPLocationError] = useState("");
  const [hourpickUPLocationError, setHourPickUPLocationError] = useState("");
  const [dropLocationError, setDropLocationError] = useState("");
  const [pickupDateError, setPickupDateError] = useState("");
  const [pickupTimeError, setPickupTimeError] = useState("");
  const [oneWayTrip, setOneWayTrip] = useState(true);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [currentDate, setCurrentDate] = useState(formattedDatexxx);
  const [pickupTime, setPickupTime] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [toastError, setToastError] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [fromLocation, setFromLocation] = useState("");
  const [dropLocation, setDropLocation] = useState("");
  const [returnTrip, setReturnTrip] = useState("No");
  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("");
  // ----------------------------------[Refs]----------------------------------
  const originRef = useRef();
  const hourlyOriginRef = useRef();
  const destinationRef = useRef();
  const hourlyRef = useRef();

  // ----------------------------------[Store]----------------------------------
  const wayPointsList = useSelector((state) => state?.waypoints?.wayPoints);
  const dispatch = useDispatch();

  // ----------------------------------[Navigation]----------------------------------
  const Navigate = useNavigate();

  // ----------------------------------[Round current time to selected Time]----------------------------------
  function roundToNearest15Minutes(time) {
    const [hour, minute, period] = time.match(/(\d+):(\d+) (AM|PM)/).slice(1);
    const roundedMinute = Math.ceil(minute / 15) * 15;
    if (roundedMinute === 60) {
      return `${hour.padStart(2, "0")}:00 ${period}`;
    } else {
      const newPeriod = hour < 12 ? "AM" : "PM";
      const roundedHour = hour % 12 || 12;
      return `${String(roundedHour).padStart(2, "0")}:${String(
        roundedMinute
      ).padStart(2, "0")} ${newPeriod}`;
    }
  }

  useEffect(() => {
    const now = new Date();
    const currentHours = now.getHours();
    var currentMinutes = now.getMinutes();

    if (currentMinutes > 45) {
      currentMinutes = currentHours + 1;
    }
    const period = currentHours >= 12 ? "PM" : "AM";
    const roundedTimings = roundToNearest15Minutes(
      `${currentHours % 12 || 12}:${String(currentMinutes).padStart(
        2,
        "0"
      )} ${period}`
    );
    setTimeout(() => {
      setPickupTime(`${roundedTimings}`);
    }, 100);
  }, []);

  // ----------------------------------[Handle Sessiondata]----------------------------------
  useEffect(() => {
    const data = JSON.parse(sessionStorage.getItem("locationData"));
    if (data) {
      setOneWayTrip(data.rideType === "oneway-trip");
      setCurrentDate(data.pickupDate);
    } else {
      setOneWayTrip("oneway-trip");
      const today = new Date();
      const formattedDate = `${today.getDate().toString().padStart(2, "0")}-${(
        today.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}-${today.getFullYear()}`;
      setCurrentDate(formattedDate);
    }
    setFromLocation(data?.source);
    setDropLocation(data?.destination);
    setSelectedTime(data?.hour);
    setPickupTime(data?.pickupTime);
    // eslint-disable-next-line
  }, []);

  // ----------------------------------[Current Data]----------------------------------
  useEffect(() => {
    const today = new Date();
    const formattedDate = `${today.getDate().toString().padStart(2, "0")}-${(
      today.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${today.getFullYear()}`;
    setCurrentDate(formattedDate);
  }, []);

  const pickUpContainer = {
    background: "black",
    display: "flex",
    flexDirection: "column",
    color: "white",
    justifyContent: "space-between",
    gap: "5px",
  };

  let sumOfKms = 0;
  let sumOfTime = 0;

  async function calculateRoute() {
    try {
      if (
        originRef.current.value === "" ||
        destinationRef.current.value === ""
      ) {
        setPickUPLocationError("Required");
        setDropLocationError("Rquired");
      } else {
        // eslint-disable-next-line no-undef
        const directionsService = new google.maps.DirectionsService();
        const results = await directionsService.route({
          origin: originRef.current.value,
          destination: destinationRef.current.value,
          // eslint-disable-next-line no-undef
          travelMode: google.maps.TravelMode.DRIVING,
        });

        results.routes[0].legs.forEach((leg) => {
          sumOfKms += leg.distance.value;
          sumOfTime += parseInt(leg.duration.value);
        });

        setDistance(sumOfKms);
        setDuration(sumOfTime);
      }
    } catch (error) {
      alert("Directions not available");
    }
  }

  const reserveAction = () => {
    var hours = 0;

    if (wayPointsList.some((item) => item.content.includes("Task"))) {
      setToastError(true);
      setToastMessage("Please select/remove empty stop");
      return;
    }

    if (
      originRef.current.value === "" ||
      originRef.current.value === undefined ||
      originRef.current.value === null
    ) {
      setPickUPLocationError("Please select pickup location");
      setToastMessage("Please select pickup location");
      setToastError(true);
      return;
    }
    if (
      destinationRef.current.value === "" ||
      destinationRef.current.value === undefined ||
      destinationRef.current.value === null
    ) {
      setDropLocationError("Please select dropoff location");
      setToastMessage("Please select dropoff location");
      setToastError(true);
      return;
    }
    if (
      currentDate === "" ||
      currentDate === undefined ||
      currentDate === null
    ) {
      setPickupDateError("Please select date");
      setToastMessage("Please select date");
      setToastError(true);
      return;
    }
    if (pickupTime === "" || pickupTime === null || pickupTime === undefined) {
      setPickupTimeError("Please select time");
      setToastMessage("Please select time");
      setToastError(true);
      return;
    }

    if (hourlyRef.current && hourlyRef.current.value !== undefined) {
      // Now you can safely use hourlyRef.current.value
      hours = parseInt(hourlyRef.current.value);
    } else {
      hours = 0; // Default value if hourlyRef.current.value is not available
    }

    const data = {
      rideType: oneWayTrip
        ? returnTrip === "Yes"
          ? "round-trip"
          : "oneway-trip"
        : "hourly-trip",
      source: originRef.current.value,
      destination: destinationRef.current.value,
      routeNo: 0,
      pickupDate: currentDate,
      pickupTime: pickupTime,
      hour: hours,
      travelTime: duration,
      travelLength: distance,
      returnTrip: returnTrip,
      returnDate,
      returnTime,
    };
    dispatch(location(data));
    sessionStorage.setItem("locationData", JSON.stringify(data));
    dispatch(activeStepx(0));

    if (wayPointsList.length === 0) {
      sessionStorage.setItem("waypoints", "[]");
    }
    Navigate("/reservation");
  };

  const mapSelector = () => {
    return (
      <div className="d-flex flex-column align-items-center">
        <div className="d-flex flex-column w-100 pkp-container">
          <small>Pickup Address</small>
          <Autocomplete>
            <input
              type="text"
              className="emptyInputOne"
              value={fromLocation}
              ref={originRef}
              onBlur={() => {
                setFromLocation(originRef.current.value);
              }}
              onChange={(e) => {
                setFromLocation(e.target.value);
                setPickUPLocationError("");
              }}
              placeholder="Search Location"
            />
          </Autocomplete>
          <div className="text-danger">{pickUPLocationError}</div>
        </div>
        <DraggableWaypoints />
        {wayPointsList?.length < 4 ? (
          <div
            className="mt-2"
            style={{
              background: "#1e1e1e",
              padding: "6px 13px",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={() => addWaypoint()}
          >
            <span
              style={{ fontSize: "13px", lineHeight: "0", fontWeight: "bold" }}
            >
              +{" "}
            </span>
            <span style={{ fontSize: "13px" }}>Add Stop</span>
          </div>
        ) : null}
        <div className="d-flex flex-column w-100 pkp-container mt-2">
          <small>Dropoff Location</small>
          <Autocomplete onPlaceChanged={() => calculateRoute()}>
            <input
              type="text"
              className="emptyInputOne inpddd"
              value={dropLocation}
              ref={destinationRef}
              onBlur={() => {
                setDropLocation(destinationRef.current.value);
              }}
              onChange={(e) => {
                setDropLocation(e.target.value);
                setDropLocationError("");
              }}
              placeholder="Search Location"
            />
          </Autocomplete>
          <div className="text-danger">{dropLocationError}</div>
        </div>
      </div>
    );
  };

  // Waypoints
  const addWaypoint = () => {
    if (wayPointsList.length < 4) {
      const newWaypoint = {
        id: (wayPointsList.length + 1).toString(),
        content: "Task " + (wayPointsList.length + 1),
      };

      const updatedWayPointsList = [...wayPointsList, newWaypoint]; // Create a new array to maintain immutability
      dispatch(wayPoints(updatedWayPointsList));
      sessionStorage.setItem("waypoints", JSON.stringify(updatedWayPointsList));
    }
  };

  useEffect(() => {
    if (toastError) {
      toast.error(toastMessage, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setToastError(false);
    }
    // eslint-disable-next-line
  }, [toastError]);

  const reserveHourlyAction = () => {
    if (hourlyOriginRef.current.value === "") {
      setHourPickUPLocationError("Please select Pickup Location");
      setToastMessage("Please select Pickup Location");
      setToastError(true);
      return;
    }

    if (currentDate === "") {
      setPickupDateError("Please select Pickup Date");
      setToastMessage("Please select Pickup Date");
      setToastError(true);
      return;
    }

    const data = {
      rideType: oneWayTrip ? "oneway-trip" : "hourly-trip",
      source: hourlyOriginRef.current.value,
      destination: "",
      pickupDate: currentDate,
      pickupTime: pickupTime,
      hour: hourlyRef.current.value,
      travelTime: duration,
      travelLength: distance,
    };

    dispatch(location(data));
    sessionStorage.setItem("locationData", JSON.stringify(data));
    sessionStorage.setItem("waypoints", "[]");
    Navigate("/reservation");
  };

  if (!isLoaded) {
    return <div>Loading...</div>; // Or any loading indicator
  }

  // Get the current date
  const currentDatex = moment();

  // Function to disable dates before the current date
  const disabledDate = (date) => {
    return date && date < currentDatex.startOf("day");
  };

  return (
    <div style={{ background: "black" }}>
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
      <div className=" d-flex flex-column" style={{ maxWidth: "100vw" }}>
        <div className="d-flex justify-content-center">
          <div
            className="bookingSelectorParent p-3"
            style={{
              textAlign: "center",
              width: "100%",
              cursor: "pointer",
              color: "white",
              fontWeight: "900",
              background: oneWayTrip ? "#c19b65" : "black",
            }}
            onClick={() => {
              setOneWayTrip(true);
              dispatch(wayPoints([]));
              sessionStorage.removeItem("waypoints");
              const existingData = JSON.parse(
                sessionStorage.getItem("locationData")
              );
              const updatedData = {
                ...existingData,
                destination: "",
              };
              sessionStorage.setItem(
                "locationData",
                JSON.stringify(updatedData)
              );
            }}
          >
            {returnTrip === "Yes" ? "Round Trip" : "One Way"}
          </div>
          <div
            className="bookingSelectorParent p-3"
            style={{
              textAlign: "center",
              // width: "200px",
              cursor: "pointer",
              color: "white",
              fontWeight: "900",
              background: !oneWayTrip ? "#c19b65" : "black",
            }}
            onClick={() => setOneWayTrip(false)}
          >
            Hourly
          </div>
          <div
            className="bookingSelectorParent p-3"
            style={{
              textAlign: "center",
              // width: "200px",
              cursor: "pointer",
              color: "white",
              fontWeight: "900",
              background: "black",
            }}
            onClick={() => Navigate("/packages")}
          >
            Packages
          </div>
        </div>
        <div className="w-100">
          {oneWayTrip ? (
            <div className="p-4 pickupContainer fadeIn" style={pickUpContainer}>
              {mapSelector()}
              <DateTimePicker
                setCurrentDate={setCurrentDate}
                setPickupDateError={setPickupDateError}
                pickupDateError={pickupDateError}
                setPickupTime={setPickupTime}
                pickupTimeError={pickupTimeError}
              />
              <div className="d-flex flex-column w-100 pkp-container mt-2">
                <small>Round Trip</small>
                <div className="d-flex mt-2">
                  <div
                    style={{
                      cursor: "pointer",
                      textAlign: "center",
                      background: returnTrip === "Yes" ? "white" : "#1e1e1e",
                      color: returnTrip === "Yes" ? "#1e1e1e" : "white",
                      border: "1px solid white",
                      width: "100%",
                      borderRadius: "5px 0 0 5px",
                      padding: "5px",
                    }}
                    onClick={() => setReturnTrip("Yes")}
                  >
                    Yes
                  </div>
                  <div
                    style={{
                      cursor: "pointer",
                      textAlign: "center",
                      background: returnTrip === "No" ? "white" : "#1e1e1e",
                      color: returnTrip === "No" ? "#1e1e1e" : "white",
                      border: "1px solid white",
                      width: "100%",
                      borderRadius: "0 5px 5px 0",
                      padding: "5px",
                    }}
                    onClick={() => setReturnTrip("No")}
                  >
                    No
                  </div>
                </div>
              </div>

              <div
                className="d-flex flex-column align-items-center roundTripContainer"
                style={{ height: returnTrip === "No" ? "0" : "250px" }}
              >
                <div className="d-flex flex-column w-100 pkp-container">
                  <small>Return Date & Time</small>
                  <DateTimePicker
                    setCurrentDate={setReturnDate}
                    setPickupDateError={setPickupDateError}
                    pickupDateError={pickupDateError}
                    setPickupTime={setReturnTime}
                    pickupTimeError={pickupTimeError}
                  />
                </div>
              </div>

              <div
                className="text-center mt-3 reserveButtonHome"
                onClick={() => reserveAction()}
              >
                Book now
              </div>
            </div>
          ) : (
            <div className="p-4 pickupContainer fadeIn" style={pickUpContainer}>
              <div>
                <div className="d-flex flex-column align-items-center">
                  <div className="d-flex flex-column w-100 pkp-container">
                    <small>Pickup Address</small>
                    <Autocomplete>
                      <input
                        type="text"
                        className="emptyInputOne"
                        ref={hourlyOriginRef}
                        value={fromLocation}
                        onBlur={(e) => {
                          setFromLocation(hourlyOriginRef.current.value);
                        }}
                        onChange={(e) => {
                          setFromLocation(e.target.value);
                          setHourPickUPLocationError("");
                        }}
                      />
                    </Autocomplete>
                    <div className="text-danger">{hourpickUPLocationError}</div>
                  </div>
                </div>
              </div>
              <DateTimePicker
                setCurrentDate={setCurrentDate}
                setPickupDateError={setPickupDateError}
                pickupDateError={pickupDateError}
                setPickupTime={setPickupTime}
                pickupTimeError={pickupTimeError}
              />
              <div className="d-flex flex-column pkp-container">
                <small>For Hours</small>
                <select
                  value={selectedTime}
                  className="emptyInputOne"
                  ref={hourlyRef}
                  onChange={(e) => setSelectedTime(e.target.value)}
                >
                  <option value={3}>3 Hr</option>
                  <option value={4}>4 Hr</option>
                  <option value={5}>5 Hr</option>
                  <option value={6}>6 Hr</option>
                  <option value={7}>7 Hr</option>
                  <option value={8}>8 Hr</option>
                  <option value={9}>9 Hr</option>
                  <option value={10}>10 Hr</option>
                  <option value={11}>11 Hr</option>
                  <option value={12}>12 Hr</option>
                  <option value={13}>13 Hr</option>
                  <option value={14}>14 Hr</option>
                </select>
              </div>
              <div
                className="text-center mt-3 reserveButtonHome"
                onClick={() => reserveHourlyAction()}
              >
                Book now
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default BookingForm;
