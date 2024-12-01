import React, { useEffect, useState } from "react";
import {
  changeTabIndexState,
  newAdminiTrip,
} from "../../store/Trips/TripSlice";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@mui/material";
import {
  DirectionsRenderer,
  GoogleMap,
  useJsApiLoader,
} from "@react-google-maps/api";
import { instance } from "../../Const/ApiHeader";
import { TRIP_COUNT } from "../../Const/ApiConst";
import { Navigate, useNavigate } from "react-router-dom";
import { toastMessage } from "../../store/toast";

const libraries = ["places"];

function TripPreviewComponent() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });

  const dispatch = useDispatch();
  const Navigate = useNavigate();

  const { locations } = useSelector((state) => state?.places);

  console.log("AASD", locations);

  const { tabIndexState, tripData } = useSelector((state) => state?.trips);
  const { singleVehicle } = useSelector((state) => state?.vehicle);
  const { wayPoints } = useSelector((state) => state?.waypoints);
  const { selectedCustomer } = useSelector((state) => state?.customer);

  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [meetAndGreet, setMeetAndGreet] = useState("No");
  const [meetGreetAmount, setMeetGreetAmount] = useState(0);
  const [TimeType, setTimeType] = useState("Day");
  const [nightCharge, setNightCharge] = useState(0);
  const [totalKms, setTotalKms] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [tripType, setTripType] = useState(0);

  var discountValue = 0;
  var finalInvoiceAmount = 0;
  var ggtotal = 0;
  var gratuty = parseFloat(locations?.gratuityAmount);

  useEffect(() => {
    checkGreeting();
    checkNight();
    loadTripsCount();
  }, []);

  const loadTripsCount = () => {
    const data = {
      customerId: selectedCustomer?.user_id,
    };
    instance
      .post(TRIP_COUNT, data)
      .then((response) => {
        if (response?.data?.count === 0) {
          setTripType(30);
        } else if (response?.data?.count % 4 === 0) {
          setTripType(20);
        } else {
          setTripType(0);
        }
      })
      .catch((err) => {});
  };

  function isTimeBetween20To06(timeString) {
    const startTime = new Date();
    startTime.setHours(20, 0, 0, 0);
    const endTime = new Date();
    endTime.setHours(6, 0, 0, 0);

    const inputTime = new Date(`2000-01-01T${locations?.pickupTime}`);

    return inputTime >= startTime || inputTime <= endTime;
  }
  const inputTime = locations?.pickupTime;
  const isBetween = isTimeBetween20To06(inputTime);

  useEffect(() => {
    if (locations && locations.rideType !== "hourly-trip") {
      const loadMapData = async () => {
        const waypointData = wayPoints?.map((element) => ({
          location: element.content,
          stopover: true,
        }));

        const directionsService = new window.google.maps.DirectionsService();

        directionsService.route(
          {
            origin: locations?.source,
            destination: locations?.destination,
            waypoints: waypointData,
            optimizeWaypoints: true,
            provideRouteAlternatives: true,
            avoidFerries: true,
            unitSystem: window.google.maps.UnitSystem.IMPERIAL,
            travelMode: window.google.maps.TravelMode.DRIVING,
          },
          (results, status) => {
            let totalKms = 0; // Initialize totalKms and totalTime
            let totalTime = 0;
            results?.routes[locations?.routeNo]?.legs?.forEach((leg, i) => {
              totalKms += parseFloat(leg.distance.value);
              totalTime += parseFloat(leg.duration.value);
            });

            setTotalKms((parseFloat(totalKms) / 1000) * 0.621371); // Update state after calculations
            setTotalTime(totalTime);

            if (status === "OK") {
              setDirectionsResponse(results);
            } else {
              console.error("Directions request failed:", status);
            }
          }
        );
      };

      if (isLoaded) {
        loadMapData();
      }
    }
    // eslint-disable-next-line
  }, [isLoaded]);

  const checkNight = () => {
    switch (locations && locations.pickupTime) {
      case "12:00 AM":
        setTimeType("Night");
        setNightCharge(20);

        break;
      case "12:15 AM":
        setTimeType("Night");
        setNightCharge(20);
        break;
      case "12:30 AM":
        setTimeType("Night");
        setNightCharge(20);
        break;
      case "12:45 AM":
        setTimeType("Night");
        setNightCharge(20);
        break;
      case "01:00 AM":
        setTimeType("Night");
        setNightCharge(20);
        break;
      case "01:15 AM":
        setTimeType("Night");
        setNightCharge(20);
        break;
      case "01:30 AM":
        setTimeType("Night");
        setNightCharge(20);
        break;
      case "01:45 AM":
        setTimeType("Night");
        setNightCharge(20);
        break;
      case "02:00 AM":
        setTimeType("Night");
        setNightCharge(20);
        break;
      case "02:15 AM":
        setTimeType("Night");
        setNightCharge(20);
        break;
      case "02:30 AM":
        setTimeType("Night");
        setNightCharge(20);
        break;
      case "02:45 AM":
        setTimeType("Night");
        setNightCharge(20);
        break;
      case "03:00 AM":
        setTimeType("Night");
        setNightCharge(20);
        break;
      case "03:15 AM":
        setTimeType("Night");
        setNightCharge(20);
        break;
      case "03:30 AM":
        setTimeType("Night");
        setNightCharge(20);
        break;
      case "03:45 AM":
        setTimeType("Night");
        setNightCharge(20);
        break;
      case "04:00 AM":
        setTimeType("Night");
        setNightCharge(20);
        break;
      case "04:15 AM":
        setTimeType("Night");
        setNightCharge(20);
        break;
      case "04:30 AM":
        setTimeType("Night");
        setNightCharge(20);
        break;
      case "04:45 AM":
        setTimeType("Night");
        setNightCharge(20);
        break;
      case "05:00 AM":
        setTimeType("Night");
        setNightCharge(20);
        break;
      case "05:15 AM":
        setTimeType("Night");
        setNightCharge(20);
        break;
      case "05:30 AM":
        setTimeType("Night");
        setNightCharge(20);
        break;
      case "05:45 AM":
        setTimeType("Night");
        setNightCharge(20);
        break;
      case "06:00 AM":
        setTimeType("Night");
        setNightCharge(0);
        break;
      case "06:15 AM":
        setTimeType("Night");
        setNightCharge(0);
        break;
      case "06:30 AM":
        setTimeType("Night");
        setNightCharge(0);
        break;
      case "06:45 AM":
        setTimeType("Night");
        setNightCharge(0);
        break;
      case "07:00 AM":
        setTimeType("Day");
        setNightCharge(0);
        break;
      case "07:15 AM":
        setTimeType("Day");
        setNightCharge(0);
        break;
      case "07:30 AM":
        setTimeType("Day");
        setNightCharge(0);
        break;
      case "07:45 AM":
        setTimeType("Day");
        setNightCharge(0);
        break;
      case "08:00 AM":
        setTimeType("Day");
        setNightCharge(0);
        break;
      case "08:15 AM":
        setTimeType("Day");
        setNightCharge(0);
        break;
      case "08:30 AM":
        setTimeType("Day");
        setNightCharge(0);
        break;
      case "08:45 AM":
        setTimeType("Day");
        setNightCharge(0);
        break;
      case "09:00 AM":
        setTimeType("Day");
        setNightCharge(0);
        break;
      case "09:15 AM":
        setTimeType("Day");
        setNightCharge(0);
        break;
      case "09:30 AM":
        setTimeType("Day");
        setNightCharge(0);
        break;
      case "09:45 AM":
        setTimeType("Day");
        setNightCharge(0);
        break;
      case "10:00 AM":
        setTimeType("Day");
        setNightCharge(0);
        break;
      case "10:15 AM":
        setTimeType("Day");
        setNightCharge(0);
        break;
      case "10:30 AM":
        setTimeType("Day");
        setNightCharge(0);
        break;
      case "10:45 AM":
        setTimeType("Day");
        setNightCharge(0);
        break;
      case "11:00 AM":
        setTimeType("Day");
        setNightCharge(0);
        break;
      case "11:15 AM":
        setTimeType("Day");
        setNightCharge(0);
        break;
      case "11:30 AM":
        setTimeType("Day");
        setNightCharge(0);
        break;
      case "11:45 AM":
        setTimeType("Day");
        setNightCharge(0);
        break;
      case "12:00 PM":
        setTimeType("Day");
        setNightCharge(0);
        break;
      case "12:15 PM":
        setTimeType("Day");
        setNightCharge(0);
        break;
      case "12:30 PM":
        setTimeType("Day");
        setNightCharge(0);
        break;
      case "12:45 PM":
        setTimeType("Day");
        setNightCharge(0);
        break;
      case "01:00 PM":
        setTimeType("Day");
        setNightCharge(0);
        break;
      case "01:15 PM":
        setTimeType("Day");
        setNightCharge(0);
        break;
      case "01:30 PM":
        setTimeType("Day");
        setNightCharge(0);
        break;
      case "01:45 PM":
        setTimeType("Day");
        setNightCharge(0);
        break;
      case "02:00 PM":
        setTimeType("Day");
        setNightCharge(0);
        break;
      case "02:15 PM":
        setTimeType("Day");
        setNightCharge(0);
        break;
      case "02:30 PM":
        setTimeType("Day");
        setNightCharge(0);
        break;
      case "02:45 PM":
        setTimeType("Day");
        setNightCharge(0);
        break;
      case "03:00 PM":
        setTimeType("Day");
        setNightCharge(0);
        break;
      case "03:15 PM":
        setTimeType("Day");
        setNightCharge(0);
        break;
      case "03:30 PM":
        setTimeType("Day");
        setNightCharge(0);
        break;
      case "03:45 PM":
        setTimeType("Day");
        setNightCharge(0);
        break;
      case "04:00 PM":
        setTimeType("Day");
        setNightCharge(0);
        break;
      case "04:15 PM":
        setTimeType("Day");
        setNightCharge(0);
        break;
      case "04:30 PM":
        setTimeType("Day");
        setNightCharge(0);
        break;
      case "04:45 PM":
        setTimeType("Day");
        setNightCharge(0);
        break;
      case "05:00 PM":
        setTimeType("Day");
        setNightCharge(0);
        break;
      case "05:15 PM":
        setTimeType("Day");
        setNightCharge(0);
        break;
      case "05:30 PM":
        setTimeType("Day");
        setNightCharge(0);
        break;
      case "05:45 PM":
        setTimeType("Day");
        setNightCharge(0);
        break;
      case "06:00 PM":
        setTimeType("Day");
        setNightCharge(0);
        break;
      case "06:15 PM":
        setTimeType("Day");
        setNightCharge(0);
        break;
      case "06:30 PM":
        setTimeType("Day");
        setNightCharge(0);
        break;
      case "06:45 PM":
        setTimeType("Day");
        setNightCharge(0);
        break;
      case "07:00 PM":
        setTimeType("Day");
        setNightCharge(0);
        break;
      case "07:15 PM":
        setTimeType("Day");
        setNightCharge(0);
        break;
      case "07:30 PM":
        setTimeType("Day");
        setNightCharge(0);
        break;
      case "07:45 PM":
        setTimeType("Day");
        setNightCharge(0);
        break;
      case "08:00 PM":
        setTimeType("Night");
        setNightCharge(20);
        break;
      case "08:15 PM":
        setTimeType("Night");
        setNightCharge(20);
        break;
      case "08:30 PM":
        setTimeType("Night");
        setNightCharge(20);
        break;
      case "08:45 PM":
        setTimeType("Night");
        setNightCharge(20);
        break;
      case "09:00 PM":
        setTimeType("Night");
        setNightCharge(20);
        break;
      case "09:15 PM":
        setTimeType("Night");
        setNightCharge(20);
        break;
      case "09:30 PM":
        setTimeType("Night");
        setNightCharge(20);
        break;
      case "09:45 PM":
        setTimeType("Night");
        setNightCharge(20);
        break;
      case "10:00 PM":
        setTimeType("Night");
        setNightCharge(20);
        break;
      case "10:15 PM":
        setTimeType("Night");
        setNightCharge(20);
        break;
      case "10:30 PM":
        setTimeType("Night");
        setNightCharge(20);
        break;
      case "10:45 PM":
        setTimeType("Night");
        setNightCharge(20);
        break;
      case "11:00 PM":
        setTimeType("Night");
        setNightCharge(20);
        break;
      case "11:15 PM":
        setTimeType("Night");
        setNightCharge(20);
        break;
      case "11:30 PM":
        setTimeType("Night");
        setNightCharge(20);
        break;
      case "11:45 PM":
        setTimeType("Night");
        setNightCharge(20);
        break;
      default:
        break;
    }
  };

  const checkGreeting = () => {
    switch (meetAndGreet) {
      case "Yes":
        setMeetGreetAmount(25);
        break;
      case "No":
        setMeetGreetAmount(0);
        break;

      default:
        break;
    }
  };

  const makePaymentAction = () => {
    const totKms = totalKms.toFixed(2);

    const bookingData = {
      source: locations?.source,
      destination: locations?.destination,
      routeNo: locations?.routeNo,
      customerId: selectedCustomer?.user_id,
      customerName: selectedCustomer?.fullName,
      vehicleId: singleVehicle?._id,
      scheduleDate: locations?.pickupDate,
      scheduleTime: locations?.pickupTime,
      shortDescription: locations?.shortDescription,
      tripStatus: "Pending",
      noOfPassengers: locations?.noOfPassengers,
      noOfBags: locations?.noOfBags,
      meetAndGreet: locations?.meetGreet,
      // totalAmount: gratuiryTypeCash ? ggtotal + gratuty : ggtotal,
      totalAmount: Math.ceil(finalInvoiceAmount),
      tripOccasion: locations?.occcation,
      tripOccasionDetails: locations?.tripOccasionDetails,
      totalKms: parseFloat(totKms),
      stops: wayPoints,
      rideType: locations?.rideType,
      totalHours: locations?.hour,
      checkInBags: locations?.checkInBags,
      carryBags: locations?.carryBags,
      gratuityAmount: locations?.gratuityAmount,
      flightInformation: locations?.flightInfo,
      needCarSeat: locations?.needCarSeat,
      seatCount: locations?.flightInfo,
      paymentMode: locations?.paymentMode,
      emailId: locations?.emailId,
      discount: locations?.discount,
      // bagType: bagType,
    };

    dispatch(newAdminiTrip(bookingData)).then((response) => {
      if (response.type === "new-admin0-trip/fulfilled") {
        dispatch(
          toastMessage({
            message: "New trip created successfully!",
            toastStatus: true,
            type: "success",
          })
        );
        Navigate("/trips");
      }
    });
  };

  // console.log('to',ggtotal+(ggtotal%100)*locations?.gratuityAmount)

  return (
    <div>
      <div className=" passenger-component justify-content-between align-items-start">
        <div className="d-flex flex-column">
          <small>Trip Type</small>
          <strong>
            {locations?.rideType === "hourly-trip"
              ? "Hourly Trip"
              : locations?.rideType === "Package"
              ? "Package"
              : "Oneway Trip"}
          </strong>
        </div>
        <div className="d-flex flex-column" style={{ marginRigth: "50px" }}>
          <small>Pick Up Location</small>

          <strong>{locations?.source}</strong>
        </div>
        <div className="d-flex flex-column">
          {locations?.rideType === "hourly-trip" ||
          locations?.rideType === "Package" ? null : (
            <>
              <small>Drop Off Location</small>
              <strong>{locations?.destination}</strong>
            </>
          )}
        </div>
      </div>
      <div className="d-flex flex-wrap mt-2">
        <div className="d-flex flex-column">
          <small>Pickup Date</small>
          <strong>{locations?.pickupDate}</strong>
        </div>
        <div
          className="d-flex flex-column me-5  text-center"
          style={{ marginLeft: "50px" }}
        >
          <small>Pickup Time</small>
          <strong>{locations?.pickupTime}</strong>
        </div>
        {locations?.rideType !== "hourly-trip" ? (
          <div className="d-flex flex-column">
            <small>Total Distance</small>
            <strong>
              {locations?.rideType === "hourly-trip"
                ? null
                : Math.round(totalKms) + " Mile(s)"}
            </strong>
          </div>
        ) : null}
      </div>
      <div className="d-flex flex-wrap justify-content-between mt-2">
        <div className="d-flex flex-column mt-2">
          <small>Selected Vehicle</small>
          <strong>{singleVehicle.vehicleName}</strong>
        </div>
      </div>

      <div className="d-flex flex-wrap gap-3 justify-content mt-2">
        <div className="d-flex flex-column">
          <small>Meet & Greet</small>
          <strong>{locations?.meetGreet}</strong>
        </div>
        <div className="d-flex flex-column">
          <small>Discount</small>
          <strong>$ {locations?.discount}</strong>
        </div>
      </div>

      <hr />

      <div style={{ display: "none" }}>
        {locations?.rideType === "oneway-trip" ? (
          parseFloat(singleVehicle?.baseDistance) > totalKms ? (
            Math.ceil(
              (ggtotal = parseFloat(singleVehicle?.basePrice) + nightCharge) +
                meetGreetAmount
            ).toFixed(2)
          ) : (
            (ggtotal =
              (Math.round(totalKms) - parseFloat(singleVehicle?.baseDistance)) *
                parseFloat(singleVehicle?.pricePerUnitDistance) +
              parseFloat(singleVehicle?.basePrice) +
              parseFloat(nightCharge)) + meetGreetAmount
          )
        ) : locations?.rideType === "hourly-trip" ? (
          <>
            {meetAndGreet === "No"
              ? isBetween
                ? (ggtotal =
                    parseFloat(locations?.hour) *
                      parseFloat(singleVehicle?.pricePerUnitHour) +
                    20 -
                    nightCharge)
                : (ggtotal =
                    parseFloat(locations?.hour) *
                      parseFloat(singleVehicle?.pricePerUnitHour) -
                    nightCharge)
              : (ggtotal =
                  parseFloat(locations?.hour) *
                    parseFloat(singleVehicle?.pricePerUnitHour) +
                  25 -
                  nightCharge)}
          </>
        ) : locations?.rideType === "Package" ? (
          locations?.meetAndGreet === "No" ? (
            isBetween ? (
              (ggtotal = parseFloat(singleVehicle?.amount) + 20 + nightCharge)
            ) : (
              (ggtotal = parseFloat(singleVehicle?.amount) + nightCharge)
            )
          ) : (
            (ggtotal = parseFloat(singleVehicle?.amount) + 25 - nightCharge)
          )
        ) : null}
      </div>
      {/* NEW */}

      {/* <div>Trip Kms {parseFloat(totalKms).toFixed(0)} Mile(s)</div>
      <div>Trip Hour </div>
      <div>Trip Kms {singleVehicle?.baseDistance} Miles(s) </div>
      <div>Trip Base Rate :{singleVehicle?.basePrice}</div>
      <div>
        Trip Rate after Base rate :$
        {parseFloat(singleVehicle?.pricePerUnitDistance)}
      </div> */}

      <div className="d-flex justify-content-end">
        <table>
          <tr>
            <td style={{ width: "300px" }}>
              Base Rate{" "}
              {locations?.rideType === "oneway-trip"
                ? `(upto ${singleVehicle?.baseDistance} mile(s))`
                : null}
            </td>
            <th className="text-end">
              $
              {locations?.rideType === "Package"
                ? parseFloat(singleVehicle?.amount).toFixed(2)
                : parseFloat(singleVehicle?.basePrice).toFixed(2)}
            </th>
          </tr>

          {locations?.rideType === "Package" ? null : (
            <tr>
              <td style={{ width: "300px" }}>Additional mile(s)</td>
              <th className="text-end">
                {totalKms - parseFloat(singleVehicle?.baseDistance) > 0
                  ? `${(
                      totalKms - parseFloat(singleVehicle?.baseDistance)
                    ).toFixed(2)} `
                  : "0.00"}{" "}
                Mile(s)
              </th>
            </tr>
          )}
          <tr>
            <td style={{ width: "300px" }}>Prime time</td>
            <th className="text-end">
              $ {TimeType == "Day" ? "0.00" : "20.00"}
            </th>
          </tr>
          <tr>
            <td style={{ width: "300px" }}>Meet and Greet</td>
            <th className="text-end">
              $ {locations?.meetGreet === "Yes" ? "25.00" : "0.00"}
            </th>
          </tr>
          <tr>
            <td style={{ width: "300px" }}>Gratuity</td>
            <th className="text-end">
              $ {((ggtotal * locations?.gratuityAmount) / 100).toFixed(2)}
            </th>
          </tr>
          <tr>
            <td style={{ width: "300px" }}>Trip Discount</td>
            <th className="text-end">$ {locations?.discount.toFixed(2)}</th>
          </tr>
        </table>
      </div>

      <div className="d-flex justify-content-end gap-4">
        <div style={{ fontSize: "25px", fontWeight: "600" }}>Grand Total</div>
        <div
          className="text-end"
          style={{ fontSize: "25px", fontWeight: "600" }}
        >
          $
          {locations?.meetAndGreet === "Yes"
            ? Math.ceil(
                (finalInvoiceAmount =
                  ggtotal +
                  parseFloat(locations?.gratuityAmount) +
                  25 -
                  locations?.discount)
              ).toFixed(2)
            : (
                (finalInvoiceAmount =
                  ggtotal + (ggtotal * locations?.gratuityAmount) / 100) -
                locations?.discount
              ).toFixed(2)}
        </div>
      </div>

      <div className="text-end mt-4">
        <Button
          size="small"
          variant="contained"
          onClick={() => {
            makePaymentAction();
            // dispatch(changeTabIndexState(tabIndexState + 1));
          }}
        >
          Save
        </Button>
      </div>
    </div>
  );
}

export default TripPreviewComponent;
