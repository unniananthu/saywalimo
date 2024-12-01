import React, { useEffect, useState } from "react";
import { Button } from "@mui/material";
import {
  useJsApiLoader,
  GoogleMap,
  Polyline,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { useDispatch, useSelector } from "react-redux";
import {
  GET_ALL_OFFERS_URL,
  IMAGE_BASE_URL,
  TRIP_COUNT,
} from "../const/ApiConst";
import Cookies from "js-cookie";
import "./review_bookings.css";
import { location } from "../store/Places";
import { activeStepx } from "../store/StepperSlice";
import { instance } from "../const/ApiHeader";
import { ToastContainer, toast } from "react-toastify";
import { getSingleVehicles } from "../store/vehicles/SingleVehicleSlice";
import { wayPoints } from "../store/WaypointSlice";
import { Checkbox, Switch, Tooltip } from "antd";
import { BsInfoCircleFill } from "react-icons/bs";
import { resetSuccess } from "../store/orders/OrderSlice";
import OrderSummarySkeleton from "../components/orderSummaryPreview/OrderSummarySkeleton";
import { BiSolidOffer } from "react-icons/bi";
import { useNavigate } from "react-router-dom";
import { FaDeleteLeft } from "react-icons/fa6";
import { FaWheelchair } from "react-icons/fa";

const center = { lat: 48.8584, lng: 2.2945 };
const libraries = ["places"];

function ReviewBooking() {
  const dispatch = useDispatch();
  // Store Data
  const { locations } = useSelector((state) => state?.locations);
  const { vehicle } = useSelector((state) => state?.selectedVehicle);
  const { vehicles, isSuccess } = useSelector((state) => state?.singleVehicle);
  const { activeStep } = useSelector((state) => state?.activeStep);

  const wayPointsList = useSelector((state) => state?.waypoints?.wayPoints);

  // states
  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [firstImage, setFirstImage] = useState(
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSvza16HOKN0P2XFV96GGa4mrOUjPL7DRy6SJNaZ7Mtre4t2GhxskiNtajQLm8rTlVk2xc&usqp=CAU"
  );
  const [noOfPersonError, setNoOfPersonError] = useState(false);
  const [errorText, setErrorText] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [totalKms, setTotalKms] = useState(
    parseFloat(locations.travelLength).toFixed(1)
  );
  // const [totalKms, setTotalKms] = useState(locations.travelLength);
  const [totalTime, setTotalTime] = useState(0);
  const [noOfPassengers, setNoOfPassengers] = useState("1");
  const [noOfBags, setNoOfBags] = useState("1");
  const [meetAndGreet, setMeetAndGreet] = useState("No");
  const [tripType, setTripType] = useState(0);
  const [TimeType, setTimeType] = useState("Day");
  const [nightCharge, setNightCharge] = useState(locations.nightCharge ?? 0);
  const [meetGreetAmount, setMeetGreetAmount] = useState(0);
  const [loadFirstImage, setLoadFirstImage] = useState(false);
  const [toggleViewOcationField, setToggleViewOcationField] = useState(false);
  const [tripOccasion, setTripOccasion] = useState("Airport transfer");
  const [tripOccasionDetails, setTripOccasionDetails] = useState("");
  const [gratuityAmount, setGratuityAmount] = useState(20);
  const [bagType, setBagType] = useState("Checked");
  const [flightInformation, setFlightInformation] = useState("");
  const [CarSeatTottle, setCarSeatTottle] = useState(false);
  const [seatCount, setSeatCount] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [polylinePaths, setPolylinePaths] = useState([]);
  const [rydeTypeState, setRydeTypeState] = useState("");
  const [needWheelChair, setNeedWheelChair] = useState("No");

  const [checkedBagCount, setCheckedBagCount] = useState(1);
  const [carryOnBagsCount, setCarryOnBagsCount] = useState(0);

  const [isCalculationDone, setIsCalculationDone] = useState(false);

  const [customerData, setCustomerData] = useState([]);
  const [voucherData, setVoucherData] = useState([]);
  const [referalOfferValue, setReferalOfferValue] = useState(0);
  const [voucherCode, setVoucherCode] = useState("");
  const [walletBalance, setWalletBalance] = useState(0);

  const [selectedSeat, setSelectedSeat] = useState("Infant (ages 0-1)");
  const [seats, setSeats] = useState([]);
  const [isTermsAgreed, setIsTermsAgreed] = useState(false);

  const agreeTerms = (e) => {
    if (e.target.checked) {
      setIsTermsAgreed(true);
    } else {
      setIsTermsAgreed(false);
    }
  };

  useEffect(() => {
    loadRydeType();
  }, [locations?.rideType]);

  const loadRydeType = () => {
    setRydeTypeState(locations?.rideType);
  };

  const handleSelectChange = (e) => {
    setSelectedSeat(e.target.value);
  };

  const handleAddSeat = () => {
    // setSeats([...seats, { type: selectedSeat, count: 1 }]);
    const seatIndex = seats.findIndex((seat) => seat.type === selectedSeat);
    if (seatIndex >= 0) {
      handleIncrement(seatIndex);
    } else {
      setSeats([...seats, { type: selectedSeat, count: 1 }]);
    }
  };

  const handleRemoveSeat = (index) => {
    const newSeats = seats.filter((seat, i) => i !== index);
    setSeats(newSeats);
  };

  const handleIncrement = (index) => {
    // Calculate the total seat count
    const totalSeats = seats.reduce((total, seat) => total + seat.count, 0);

    if (totalSeats <= 5) {
      const newSeats = seats.map((seat, i) =>
        i === index ? { ...seat, count: seat.count + 1 } : seat
      );

      setSeats(newSeats);
    } else {
      // Optional: handle the case when total seat count is 6 or more
      console.log("Maximum total seat count reached");
    }
  };

  const handleDecrement = (index) => {
    const newSeats = seats.map((seat, i) =>
      i === index && seat.count > 1 ? { ...seat, count: seat.count - 1 } : seat
    );
    setSeats(newSeats);
  };

  var discountValue = 0;
  var finalInvoiceAmount = 0;

  const checkNight = () => {
    switch (locations.pickupTime) {
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
      case "1:00 AM":
        setTimeType("Night");
        setNightCharge(20);
        break;
      case "1:15 AM":
        setTimeType("Night");
        setNightCharge(20);
        break;
      case "1:30 AM":
        setTimeType("Night");
        setNightCharge(20);
        break;
      case "1:45 AM":
        setTimeType("Night");
        setNightCharge(20);
        break;
      case "2:00 AM":
        setTimeType("Night");
        setNightCharge(20);
        break;
      case "2:15 AM":
        setTimeType("Night");
        setNightCharge(20);
        break;
      case "2:30 AM":
        setTimeType("Night");
        setNightCharge(20);
        break;
      case "2:45 AM":
        setTimeType("Night");
        setNightCharge(20);
        break;
      case "3:00 AM":
        setTimeType("Night");
        setNightCharge(20);
        break;
      case "3:15 AM":
        setTimeType("Night");
        setNightCharge(20);
        break;
      case "3:30 AM":
        setTimeType("Night");
        setNightCharge(20);
        break;
      case "3:45 AM":
        setTimeType("Night");
        setNightCharge(20);
        break;
      case "4:00 AM":
        setTimeType("Night");
        setNightCharge(20);
        break;
      case "4:15 AM":
        setTimeType("Night");
        setNightCharge(20);
        break;
      case "4:30 AM":
        setTimeType("Night");
        setNightCharge(20);
        break;
      case "4:45 AM":
        setTimeType("Night");
        setNightCharge(20);
        break;
      case "5:00 AM":
        setTimeType("Night");
        setNightCharge(20);
        break;
      case "5:15 AM":
        setTimeType("Night");
        setNightCharge(20);
        break;
      case "5:30 AM":
        setTimeType("Night");
        setNightCharge(20);
        break;
      case "5:45 AM":
        setTimeType("Night");
        setNightCharge(20);
        break;
      case "6:00 AM":
        setTimeType("Night");
        setNightCharge(0);
        break;
      case "6:15 AM":
        setTimeType("Night");
        setNightCharge(0);
        break;
      case "6:30 AM":
        setTimeType("Night");
        setNightCharge(0);
        break;
      case "6:45 AM":
        setTimeType("Night");
        setNightCharge(0);
        break;
      case "7:00 AM":
        setTimeType("Day");
        setNightCharge(0);
        break;
      case "7:15 AM":
        setTimeType("Day");
        setNightCharge(0);
        break;
      case "7:30 AM":
        setTimeType("Day");
        setNightCharge(0);
        break;
      case "7:45 AM":
        setTimeType("Day");
        setNightCharge(0);
        break;
      case "8:00 AM":
        setTimeType("Day");
        setNightCharge(0);
        break;
      case "8:15 AM":
        setTimeType("Day");
        setNightCharge(0);
        break;
      case "8:30 AM":
        setTimeType("Day");
        setNightCharge(0);
        break;
      case "8:45 AM":
        setTimeType("Day");
        setNightCharge(0);
        break;
      case "9:00 AM":
        setTimeType("Day");
        setNightCharge(0);
        break;
      case "9:15 AM":
        setTimeType("Day");
        setNightCharge(0);
        break;
      case "9:30 AM":
        setTimeType("Day");
        setNightCharge(0);
        break;
      case "9:45 AM":
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
        setTimeType("Day");
        setNightCharge(20);
        break;
      case "08:15 PM":
        setTimeType("Day");
        setNightCharge(20);
        break;
      case "08:30 PM":
        setTimeType("Day");
        setNightCharge(20);
        break;
      case "08:45 PM":
        setTimeType("Day");
        setNightCharge(20);
        break;
      case "09:00 PM":
        setTimeType("Day");
        setNightCharge(20);
        break;
      case "09:15 PM":
        setTimeType("Day");
        setNightCharge(20);
        break;
      case "09:30 PM":
        setTimeType("Day");
        setNightCharge(20);
        break;
      case "09:45 PM":
        setTimeType("Day");
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

  // Actions

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });

  // Use Effect

  const [imgData, setImgData] = useState([]);
  useEffect(() => {
    if (isSuccess) {
      setImgData(vehicles);
      setFirstImage(vehicles[0]?.images[0]);
    }
  }, [isSuccess]);

  useEffect(() => {
    setTimeout(() => {
      checkNight();
    }, 200);
  }, [activeStep]);

  useEffect(() => {
    checkGreeting();
  }, [meetAndGreet]);

  useEffect(() => {
    // const data = JSON.parse(sessionStorage.getItem("vehicleData"));
    // if (data === null || data === undefined) {
    //   dispatch(getSingleVehicles(data));
    // } else {
    //   dispatch(getSingleVehicles({ vhid: vehicle }));
    // }

    dispatch(getSingleVehicles({ vhid: vehicle }));
  }, []);

  useEffect(() => {
    if (locations?.rideType !== "hourly-trip") {
      if (wayPointsList.length === 0) {
        const data = JSON.parse(sessionStorage.getItem("waypoints"));
        dispatch(wayPoints(data));
      }
    }
  }, []);

  const navigate = useNavigate();
  useEffect(() => {
    if (!locations.pickupDate && !locations.pickupTime) {
      navigate("/");
    }
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    checkNight();
    // eslint-disable-next-line
  }, [locations.pickupTime]);

  useEffect(() => {
    loadOffers();
    setTimeout(() => {
      setLoadFirstImage(true);
      setTotalKms(parseFloat(locations.travelLength).toFixed(0));
      // setFirstImage(data[0]?.images[0]);
    }, 100);
  }, []);

  const loadOffers = async () => {
    const data = {
      cid: JSON.parse(Cookies.get("udtl")).uid,
      email: JSON.parse(Cookies.get("udtl")).email,
    };
    const result = await instance.post(GET_ALL_OFFERS_URL, data);

    setCustomerData(result.data[0]);
    setVoucherData(result.data[1]);
  };

  useEffect(() => {
    loadTripsCount();
  }, []);

  useEffect(() => {
    if (noOfPersonError) {
      showToast();
    }
  }, [noOfPersonError]);

  useEffect(() => {
    if (locations.rideType !== "hourly-trip") {
      const loadMapData = async () => {
        const waypointData = wayPointsList?.map((element) => ({
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
            let totalKms = 0;
            let totalTime = 0;

            results?.routes[locations?.routeNo].legs.forEach((leg, i) => {
              totalKms += parseFloat(leg.distance.value);
              totalTime += parseFloat(leg.duration.value);
            });

            // setTotalKms((parseFloat(totalKms) / 1000) * 0.621371); // Update state after calculations
            setTotalTime(totalTime);
            if (status === window.google.maps.DirectionsStatus.OK) {
              setDirectionsResponse(results);

              // Extract and set polyline paths
              const paths = results.routes.map((route) =>
                route.overview_path.map((point) => ({
                  lat: point.lat(),
                  lng: point.lng(),
                }))
              );

              setPolylinePaths(paths);
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

  const tripOccasionAction = (e) => {
    setTripOccasion(e.target.value);
    if (e.target.value === "Other") {
      setToggleViewOcationField(true);
    } else {
      setToggleViewOcationField(false);
    }
  };

  const loadTripsCount = () => {
    const data = {
      customerId: JSON.parse(Cookies.get("udtl")).uid,
    };
    instance
      .post(TRIP_COUNT, data)
      .then((response) => {
        if (response?.data?.count === 0) {
          setTripType(30);
        } else if (response?.data?.count % 3 === 0) {
          setTripType(20);
        } else {
          setTripType(0);
        }
        setIsCalculationDone(true);
      })
      .catch((err) => {});
  };

  const showToast = () =>
    toast.error(errorText, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });

  const loadVehicle = () => {
    return imgData?.map((res, i) => {
      return (
        <div
          key={i}
          className="d-flex flex-column review-vehicle-container p-13"
          style={{
            border: "1px solid #b5b5b575",
            borderRadius: "15px",
          }}
        >
          <div className="w-100">
            <img
              src={IMAGE_BASE_URL + firstImage}
              alt=""
              className="mobImgx"
              style={{
                height: "300px",
                width: "100%",
                objectFit: "cover",
                borderRadius: "6px",
                border: "1px solid #b5b5b575",
              }}
            />
          </div>

          <div className="text-end d-flex flex-column">
            <div
              className="mt-3"
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "10px",
                width: "100%",
                overflow: "auto",
              }}
            >
              {res?.images?.map((res, ii) => (
                <img
                  key={ii}
                  src={IMAGE_BASE_URL + res}
                  alt=""
                  style={{
                    // width: "100px",
                    height: "80px",
                    cursor: "pointer",
                    objectFit: "cover",
                    borderRadius: "6px",
                  }}
                  onClick={() => setFirstImage(res)}
                />
              ))}
            </div>
            {/* <div>
              <div style={{ fontSize: "22px", fontWeight: "900" }}>
                {res.vehicleName}
              </div>
              <div style={{ fontSize: "18px", fontWeight: "200" }}>
                {res.feature}
              </div>
            </div> */}
            {/* <div sty>
              <div style={{ color: "#C59C6C" }}>
                Maximum passengers : {res?.maxPersons}
              </div>
              <div style={{ color: "#C59C6C" }}>Max bags : {res?.maxBags}</div>
            </div> */}
            <div style={{ fontSize: "30px", fontWeight: "200" }}>
              {/* ${" "}
              {parseFloat(res.basePrice)
                .toFixed(2)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")} */}
            </div>
          </div>
        </div>
      );
    });
  };

  const makePaymentAction = () => {
    dispatch(resetSuccess(false));
    const userCookie = Cookies.get("udtl");
    let customerId = null;

    if (userCookie) {
      try {
        const userData = JSON.parse(userCookie);
        customerId = userData.uid;
      } catch (error) {
        console.error("Error parsing user cookie:", error);
      }
    }

    if (!noOfPassengers) {
      setNoOfPersonError(true);
      setErrorText("Please enter number of passengers");
      return;
    }
    const bookingData = {
      source: locations?.source,
      destination: locations?.destination,
      routeNo: locations?.routeNo,
      customerId: customerId,
      vehicleId: vehicle,
      scheduleDate: locations?.pickupDate,
      scheduleTime: locations?.pickupTime,
      shortDescription,
      tripStatus: "Booked",
      noOfPassengers,
      noOfBags,
      meetAndGreet,
      hour: locations.hour,
      // totalAmount: gratuiryTypeCash ? ggtotal + gratuty : ggtotal,
      totalAmount: finalInvoiceAmount - walletBalance - referalOfferValue,
      tripOccasion,
      tripOccasionDetails,
      totalKms: totalKms,
      stops: wayPointsList,
      rideType: locations?.rideType,
      totalHours: locations?.hour,
      bagType: bagType,
      flightInformation: flightInformation,
      needCarSeat: CarSeatTottle ? "Yes" : "No",
      seatCount: seats,
      shortDescription: additionalInfo,
      travelLength: totalKms,
      gratuiryTypeCash: !gratuiryTypeCash ? "Cash" : "Auto-Charge Online",
      gratuityAmount: gratuityAmount,
      nightCharge: nightCharge,
      discount: parseFloat(discountValue),
      voucherAmount: referalOfferValue + walletBalance,
      voucherCode: voucherCode,
      walletBalance: walletBalance,
      returnDate: locations?.returnDate,
      returnTime: locations?.returnTime,
      needWheelChair,
      carryOnBagsCount,
      checkedBagCount,
    };

    dispatch(location(bookingData));
    dispatch(activeStepx(2));
    // }
  };

  var ggtotal = 0;
  var gratuty = 0;

  const handleOptionChange = (event) => {
    setMeetAndGreet(event.target.value);
  };

  function isTimeBetween20To06(timeString) {
    // Create Date objects for 20:00 and 06:00 times on the current date
    const startTime = new Date();
    startTime.setHours(20, 0, 0, 0); // 20:00:00.000
    const endTime = new Date();
    endTime.setHours(6, 0, 0, 0); // 06:00:00.000 on the next day

    // Parse the input time string and create a Date object for it
    const inputTime = new Date(`2000-01-01T${locations?.pickupTime}`);

    // Check if the input time is between 20:00 and 06:00
    return inputTime >= startTime || inputTime <= endTime;
  }

  // Example usage:
  const inputTime = locations?.pickupTime;
  const isBetween = isTimeBetween20To06(inputTime);

  const [gratuiryTypeCash, setGratuiryTypeCash] = useState(true);
  const [gratuityAmountC, setGratuityAmountC] = useState(0);

  const gratuityAction = (e) => {
    if (e.target.value === "Cash") {
      setGratuiryTypeCash(false);
    } else {
      setGratuiryTypeCash(true);
      setGratuityAmountC((ggtotal * gratuityAmount) / 100);
    }
  };

  const setCheckBagAction = (value, e) => {
    setCheckedBagCount(value);
    setCarryOnBagsCount(e - value);
  };

  const setCarryBagAction = (value, e) => {
    setCarryOnBagsCount(value);
    setCheckedBagCount(noOfBags - value);
  };

  const bagSeting = () => {
    const countChuckIn = noOfBags - checkedBagCount;
    setCarryOnBagsCount(countChuckIn);
  };
  useEffect(() => {
    bagSeting();
  }, [checkedBagCount]);
  useEffect(() => {
    setCheckedBagCount(noOfBags);
  }, [noOfBags]);

  const calculateSumOfSeats = () => {
    return seats.reduce((total, res) => total + (res?.count || 0), 0) * 25;
  };

  const calculateMeetAndGreet = () => {
    return meetAndGreet === "Yes" ? 25 : 0;
  };
  return (
    <>
      <ToastContainer />
      <div>
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-8 pt-3 pb-3 ps-0 pe-0">
              <div className="review-booking-card m-0">
                {loadVehicle()}

                <div
                  className="d-flex justify-content-between p-13 mt-3"
                  style={{
                    border: "1px solid #b5b5b575",
                    borderRadius: "15px",
                    color: "white",
                    background:
                      "linear-gradient(90deg, rgb(73, 61, 47), rgb(182, 152, 118))",
                    padding: "10px",
                    borderRadius: "10px",
                  }}
                >
                  <div>
                    <div style={{ fontSize: "20px", fontWeight: "900" }}>
                      {vehicles[0]?.vehicleName}
                    </div>
                    <div style={{ fontSize: "12px", fontWeight: "200" }}>
                      {vehicles[0]?.feature}
                    </div>
                  </div>
                  <div className="p-2 text-end">
                    <div
                      style={{
                        fontSize: "18px",
                      }}
                    >
                      {" "}
                      {locations.rideType === "oneway-trip" ? (
                        <div>
                          <div>Oneway Trip</div>
                          <small>
                            Reservations are only meant for Airport/Cruise
                            Transfers
                          </small>
                        </div>
                      ) : locations.rideType === "round-trip" ? (
                        <div>
                          <div>Round Trip</div>
                          <small>
                            Reservations are meant for up and down Transfers
                          </small>
                        </div>
                      ) : (
                        "Hourly Trip"
                      )}
                    </div>
                    <div style={{ fontSize: "12px" }}>Terms & Conditions</div>
                  </div>
                </div>
                <div
                  style={{
                    border: "1px solid #b5b5b575",
                    borderRadius: "15px",
                  }}
                  className="mt-3"
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                    className="p-13"
                  >
                    <span style={{ fontSize: "14px" }}>
                      Travel date & time:
                    </span>
                    <span style={{ fontWeight: "600" }}>
                      {locations.pickupDate} - {locations.pickupTime}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between p-13">
                    <div>
                      <div style={{ fontSize: "10px" }}>Pickup,</div>
                      <div>{locations.source}</div>
                      {locations.rideType === "oneway-trip" ? (
                        <div style={{ fontSize: "12px", fontWeight: "200" }}>
                          {parseFloat(totalKms).toFixed(1)} mile(s)
                        </div>
                      ) : (
                        <div style={{ fontSize: "12px", fontWeight: "200" }}>
                          {locations.hour} Hours
                        </div>
                      )}
                    </div>
                    {locations.rideType === "hourly-trip" ? null : (
                      <div>
                        <div style={{ fontSize: "10px" }}>Dropoff,</div>
                        <div>{locations.destination}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <div
                  className="review-booking-card p-13 mt-3"
                  style={{
                    border: "1px solid #b5b5b575",
                    borderRadius: "15px",
                  }}
                >
                  <div style={{ fontWeight: "600" }} className="mb-2">
                    Passenger Details
                  </div>
                  <div className="psngr-dtls-container gap-2">
                    <div className="pkp-containerz w-100">
                      <small>
                        Trip Occasion(s) <span className="text-danger">*</span>
                      </small>
                      <select
                        className="emptyInput"
                        onChange={(e) => tripOccasionAction(e)}
                      >
                        <option>Airport Transfer</option>
                        <option>Wedding</option>
                        <option>Quinceañera/Birthday</option>
                        <option>Concert/Stadium Event</option>
                        <option>Homecoming/Prom</option>
                        <option>Other</option>
                      </select>
                      <div>
                        {toggleViewOcationField ? (
                          <input
                            type="text"
                            className="emptyInput"
                            placeholder="Please specify"
                            onChange={(e) =>
                              setTripOccasionDetails(e.target.value)
                            }
                          />
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                    <div className="pkp-containerz w-100">
                      <div className="d-flex align-items-center gap-2">
                        <small>
                          No of passengers{" "}
                          <span className="text-danger">*</span>
                        </small>
                        <small style={{ fontSize: "10px" }}>
                          ( Max - {parseInt(vehicles[0]?.maxPersons)})
                        </small>
                      </div>
                      <select
                        className="emptyInput"
                        value={noOfPassengers}
                        onChange={(e) => {
                          setNoOfPersonError(false);
                          setNoOfPassengers(e.target.value);
                        }}
                      >
                        {Array.from(
                          { length: parseInt(vehicles[0]?.maxPersons) },
                          (_, index) => (
                            <option value={index + 1}>{index + 1}</option>
                          )
                        )}
                      </select>
                    </div>
                    <div className="pkp-containerz d-flex flex-column w-100">
                      <div className="d-flex justify-content-between">
                        <small>Meet & Greet</small>
                        <Tooltip
                          placement="top"
                          color="black"
                          title={
                            <div
                              style={{ fontSize: "13px", fontWeight: "400" }}
                            >
                              "Meet-and-greet limo service will meet (and greet)
                              you at the airport. When you get off your flight,
                              there will be someone there to greet you and take
                              care of your luggage. They will then escort you to
                              the awaiting limousine outside and the chauffeur
                              will take you to your requested destination"
                            </div>
                          }
                        >
                          <span>
                            <BsInfoCircleFill />
                          </span>
                        </Tooltip>
                      </div>

                      <div className="d-flex  gap-4">
                        <div className="">
                          <input
                            type="radio"
                            id="meet-yes"
                            name="meet"
                            value={"Yes"}
                            checked={meetAndGreet === "Yes"}
                            onChange={handleOptionChange}
                          />
                          <label htmlFor="meet-yes">&nbsp; Yes </label>
                        </div>
                        <div>
                          <input
                            type="radio"
                            id="meet-no"
                            name="meet"
                            value={"No"}
                            checked={meetAndGreet === "No"}
                            onChange={handleOptionChange}
                          />
                          <label htmlFor="meet-no"> &nbsp;No</label>
                        </div>
                      </div>
                    </div>
                    <div className="pkp-containerz d-flex flex-column w-100">
                      <div className="d-flex align-items-center gap-2">
                        <small>Gratuity (%)</small>
                        <small style={{ fontSize: "8px" }}>(min 20%)</small>
                      </div>
                      <div>
                        <select
                          className="emptyInput"
                          value={gratuityAmount}
                          onChange={(e) => setGratuityAmount(e.target.value)}
                        >
                          <option value={20}>20 %</option>
                          <option value={25}>25 %</option>
                          <option value={30}>30 %</option>
                          <option value={35}>35 %</option>
                          <option value={40}>40 %</option>
                        </select>
                      </div>
                      {/* <div
                        className="d-flex"
                        style={{ display: "none !important" }}
                      >
                        <div style={{ marginTop: "13px", display: "none" }}>
                          <select
                            className="emptyInput"
                            onChange={(e) => gratuityAction(e)}
                          >
                            <option>Cash</option>
                            <option>Auto-Charge Online</option>
                          </select>
                        </div>
                        <div
                          style={{ marginTop: "13px" }}
                          className="d-flex align-items-center"
                        >
                          <input
                            type="number"
                            className="emptyInput"
                            id="20"
                            style={{ width: "60px" }}
                            value={gratuityAmount}
                            onChange={(e) => setGratuityAmount(e.target.value)}
                            onBlur={(e) => checkGratuity(e)}
                            required
                          />
                          <span>%</span>
                        </div>
                      </div> */}
                    </div>
                  </div>
                  <div style={{ fontWeight: "600" }} className="mt-3 mb-2">
                    Additional Information
                  </div>
                  <div className="psngr-dtls-container gap-2">
                    <div className="pkp-containerz w-100">
                      <small>No of Bags</small>

                      {/* <select
                        className="emptyInput"
                        value={noOfBags}
                        onChange={(e) => setNoOfBags(e.target.value)}
                      >
                        {Array.from(
                          { length: parseInt(vehicles[0]?.maxBags) },
                          (_, index) => (
                            <option value={index + 1}>{index + 1}</option>
                          )
                        )}
                      </select> */}
                      <div className="d-flex flex-column">
                        <small style={{ fontSize: "10px" }} className="mb-1">
                          Maximum - {parseInt(vehicles[0]?.maxBags)}
                        </small>
                        <div className="d-flex">
                          {" "}
                          <div
                            style={{
                              cursor: "pointer",
                              background: "white",
                              borderRadius: " 5px 0 0 5px",
                              width: "35px",
                              height: "30px",
                              color: "black",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            onClick={() => {
                              noOfBags > 0 &&
                                setNoOfBags(parseInt(noOfBags) - 1);
                            }}
                          >
                            -
                          </div>
                          <div
                            className="w-100 text-center"
                            style={{
                              border: "1px solid white",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              background: "white",
                            }}
                          >
                            {noOfBags}
                          </div>
                          <div
                            style={{
                              cursor: "pointer",
                              background: "white",
                              borderRadius: "0 5px 5px 0",
                              width: "35px",
                              height: "30px",
                              color: "black",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                            onClick={() => {
                              noOfBags < parseInt(vehicles[0]?.maxBags) &&
                                setNoOfBags(parseInt(noOfBags) + 1);
                            }}
                          >
                            +
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="pkp-containerz w-100">
                      <small>Describe bag types</small>

                      <div className="d-flex   gap-2">
                        <div className="d-flex flex-column justify-content-between w-100">
                          <small style={{ fontSize: "10px" }} className="mb-1">
                            Checked Bags
                          </small>

                          <select
                            className="emptyInput"
                            value={checkedBagCount}
                            onChange={(e) =>
                              setCheckBagAction(
                                e.target.value,
                                vehicles[0]?.maxBags
                              )
                            }
                          >
                            {Array.from(
                              { length: parseInt(noOfBags) + 1 },
                              (_, index) => (
                                <option key={index}>{index}</option>
                              )
                            )}
                          </select>
                        </div>
                        <div className="d-flex flex-column justify-content-between w-100">
                          <small style={{ fontSize: "10px" }} className="mb-1">
                            Carry-on
                          </small>
                          <select
                            className="emptyInput"
                            value={carryOnBagsCount}
                            onChange={(e) =>
                              setCarryBagAction(
                                e.target.value,
                                vehicles[0]?.maxBags
                              )
                            }
                          >
                            {Array.from(
                              { length: parseInt(noOfBags) + 1 },
                              (_, index) => (
                                <option key={index}>{index}</option>
                              )
                            )}
                          </select>
                        </div>
                      </div>
                    </div>
                    <div
                      className="pkp-containerz w-100"
                      style={{ display: "none" }}
                    >
                      <small>Do you need car seat?</small>
                      <div className="d-flex gap-2  gap-4">
                        <div>
                          <input
                            type="radio"
                            id="car-seat-yes"
                            name="carseat"
                            className="me-1"
                            checked={CarSeatTottle}
                            onClick={() => setCarSeatTottle(true)}
                          />
                          <label
                            htmlFor="car-seat-yes"
                            onClick={() => setCarSeatTottle(true)}
                          >
                            Yes
                          </label>
                        </div>
                        <div>
                          <input
                            type="radio"
                            id="car-seat-no"
                            name="carseat"
                            className="me-1"
                            checked={CarSeatTottle ? false : true}
                            onClick={() => setCarSeatTottle(false)}
                          />
                          <label
                            htmlFor="car-seat-no"
                            onClick={() => setCarSeatTottle(false)}
                          >
                            No
                          </label>
                        </div>
                      </div>
                    </div>
                    {/* 
                    {CarSeatTottle && (
                      <div className="pkp-containerz d-flex flex-column w-100">
                        <small>How many / What type</small>
                        <input
                          type="text"
                          className="emptyInput"
                          value={seatCount}
                          placeholder="eg: 1 Child seat"
                          onChange={(e) =>
                            CarSeatTottle
                              ? setSeatCount(e.target.value)
                              : setSeatCount("")
                          }
                        />
                      </div>
                    )} */}

                    <div className="pkp-containerz">
                      <small>+ Add Seat</small>
                      <div className="d-flex align-items-center">
                        <select
                          className="w-100"
                          onChange={handleSelectChange}
                          style={{
                            padding: "3px 10px",
                            border: "0",
                            borderRadius: "5px 0 0 5px",
                          }}
                        >
                          <option>Infant (ages 0-1)</option>
                          <option>Toddler Seat (ages 1-3)</option>
                          <option>Booster Seat (ages 3-6)</option>
                        </select>
                        <div
                          style={{
                            border: "1px solid white",
                            textAlign: "center",
                            width: "40px",
                            padding: "10px",
                            height: "30px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            borderRadius: "0 5px 5px 0",
                          }}
                          onClick={handleAddSeat}
                        >
                          +
                        </div>
                      </div>

                      <ul>
                        {seats.map((seat, index) => (
                          <li key={index} className="d-flex align-items-center">
                            <small>{seat.type}</small>
                            <div
                              style={{
                                border: "1px solid white",
                                textAlign: "center",
                                width: "40px",
                                padding: "10px",
                                height: "30px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                marginLeft: "10px",
                              }}
                              onClick={() => handleDecrement(index)}
                            >
                              -
                            </div>
                            <input
                              type="text"
                              value={seat.count}
                              readOnly
                              style={{
                                width: "40px",
                                textAlign: "center",
                                marginLeft: "10px",
                              }}
                            />
                            <div
                              style={{
                                border: "1px solid white",
                                textAlign: "center",
                                width: "40px",
                                padding: "10px",
                                height: "30px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                                marginLeft: "10px",
                              }}
                              onClick={() => handleIncrement(index)}
                            >
                              +
                            </div>
                            <FaDeleteLeft
                              size={20}
                              style={{ marginLeft: "10px", cursor: "pointer" }}
                              onClick={() => handleRemoveSeat(index)}
                            />
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pkp-containerz ">
                      <small>
                        <FaWheelchair /> Wheelchair passenger
                      </small>
                      <div>
                        <Switch
                          onChange={(value) => {
                            value
                              ? setNeedWheelChair("Yes")
                              : setNeedWheelChair("No");
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="pkp-containerz w-100 mt-2">
                    <small>Flight Information (Optional)</small>
                    <input
                      type="text"
                      className="emptyInput"
                      onChange={(e) => setFlightInformation(e.target.value)}
                    />
                  </div>

                  <div className="pkp-containerz mt-2">
                    <small>Description</small>
                    <textarea
                      className="emptyInput"
                      placeholder="Please tell us your needs, eg: Need wheel chair."
                      onChange={(e) => setAdditionalInfo(e.target.value)}
                    ></textarea>
                  </div>
                  <div className="mt-2 d-flex ">
                    <div className="w-100">{}</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-12 col-md-4 p-13">
              <div style={{ display: "none" }}>
                {locations.rideType !== "hourly-trip" ? (
                  <div className="container p-0">
                    <div
                      style={{
                        width: "100%",
                      }}
                    >
                      {/* Google Map Box */}
                      <GoogleMap
                        center={center}
                        zoom={8}
                        mapContainerStyle={{ width: "100%", height: "350px" }}
                        options={{
                          zoomControl: true,
                          streetViewControl: true,
                          mapTypeControl: false,
                          fullscreenControl: false,
                          options: {
                            language: "en", // Set the desired language code
                            region: "us",
                          },
                        }}
                      >
                        <Polyline
                          path={polylinePaths[polylinePaths.length - 1]}
                          options={{
                            strokeWeight: 5,
                            strokeOpacity: 1,
                            strokeColor: "black",
                          }}
                          draggable={false}
                        />

                        <DirectionsRenderer
                          // key={i}
                          directions={directionsResponse}
                          options={{
                            polylineOptions: {
                              strokeColor: "transparent",
                              strokeWeight: 0,
                              draggable: false,
                            },
                            routeIndex: 0,
                            draggable: false,
                          }}
                          draggable={false}
                        />
                      </GoogleMap>
                    </div>
                  </div>
                ) : null}
              </div>
              {isCalculationDone ? (
                <div
                  className="review-booking-card p-13"
                  style={{
                    border: "1px solid #b5b5b575",
                    borderRadius: "15px",
                    position: "sticky",
                    top: "10px",
                    border: "1px solid #e5bb73",
                    boxShadow: "-10px -5px 40px 0 rgba(0, 0, 0, .1)",
                  }}
                >
                  <div style={{ fontWeight: "600", fontSize: "20px" }}>
                    Price Details
                  </div>

                  {locations.rideType !== "hourly-trip" ? (
                    <div className="d-flex justify-content-between">
                      <div style={{ fontSize: "14px", fontWeight: "300" }}>
                        Base Rate (upto {vehicles[0]?.baseDistance} mile(s))
                      </div>
                      <div
                        className="text-end"
                        style={{ fontSize: "14px", fontWeight: "300" }}
                      >
                        ${" "}
                        {parseFloat(vehicles[0]?.basePrice)
                          .toFixed(2)
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </div>
                    </div>
                  ) : null}
                  {locations.rideType === "hourly-trip" ? (
                    <div className="d-flex justify-content-between">
                      <div style={{ fontSize: "14px", fontWeight: "300" }}>
                        Hours
                      </div>
                      <div
                        className="text-end"
                        style={{ fontSize: "14px", fontWeight: "300" }}
                      >
                        {locations.hour} Hours
                      </div>
                    </div>
                  ) : (
                    <div className="d-flex justify-content-between">
                      <div style={{ fontSize: "14px", fontWeight: "300" }}>
                        Additional mile(s)
                      </div>
                      <div
                        className="text-end"
                        style={{ fontSize: "14px", fontWeight: "300" }}
                      >
                        {/* {parseFloat(totalKms).toFixed(1)} Miles */}
                        {totalKms - parseFloat(vehicles[0]?.baseDistance) <= 0
                          ? Math.round(0)
                          : Math.round(
                              totalKms - parseFloat(vehicles[0]?.baseDistance)
                            )}
                        Mile(s)
                      </div>
                    </div>
                  )}

                  {locations.rideType === "hourly-trip" ? (
                    <div className="d-flex justify-content-between">
                      <div style={{ fontSize: "14px", fontWeight: "300" }}>
                        Rate per hour
                      </div>
                      <div
                        className="text-end"
                        style={{ fontSize: "14px", fontWeight: "300" }}
                      >
                        ${" "}
                        {parseFloat(vehicles[0]?.pricePerUnitHour)
                          .toFixed(2)
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                      </div>
                    </div>
                  ) : totalKms - parseFloat(vehicles[0]?.baseDistance) >= 0 ? (
                    <div className="d-flex justify-content-between">
                      <div style={{ fontSize: "14px", fontWeight: "300" }}>
                        Rate for additional mile(s)
                      </div>
                      <div
                        className="text-end"
                        style={{ fontSize: "14px", fontWeight: "300" }}
                      >
                        ${" "}
                        {parseFloat(vehicles[0]?.pricePerUnitDistance)
                          .toFixed(2)
                          .toString()
                          .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                        /mile
                      </div>
                    </div>
                  ) : (
                    ""
                  )}
                  <hr />
                  {nightCharge > 0 ? (
                    <div className="d-flex justify-content-between">
                      <div style={{ fontSize: "14px", fontWeight: "300" }}>
                        Prime Time
                      </div>
                      <div
                        className="text-end"
                        style={{ fontSize: "14px", fontWeight: "300" }}
                      >
                        $ 20.00
                      </div>
                    </div>
                  ) : (
                    <div className="d-flex justify-content-between">
                      <div
                        style={{ fontSize: "14px", fontWeight: "300" }}
                      ></div>
                      <div
                        className="text-end"
                        style={{ fontSize: "14px", fontWeight: "300" }}
                      ></div>
                    </div>
                  )}
                  {meetAndGreet === "Yes" ? (
                    <div className="d-flex justify-content-between">
                      <div style={{ fontSize: "14px", fontWeight: "300" }}>
                        Meet & Greet
                      </div>
                      <div
                        className="text-end"
                        style={{ fontSize: "14px", fontWeight: "300" }}
                      >
                        ${calculateMeetAndGreet().toFixed(2)}
                      </div>
                    </div>
                  ) : null}
                  {calculateSumOfSeats() != 0 && (
                    <div className="d-flex justify-content-between">
                      <div style={{ fontSize: "14px", fontWeight: "300" }}>
                        Seat price {gratuiryTypeCash ? "" : "Pay by Cash"}
                      </div>
                      <div style={{ fontSize: "14px", fontWeight: "300" }}>
                        {calculateSumOfSeats()}
                      </div>
                    </div>
                  )}

                  {
                    <div className="d-flex justify-content-between">
                      <div style={{ fontSize: "14px" }}>
                        Gratuity {gratuiryTypeCash ? "" : "Pay by Cash"}
                      </div>
                      <div style={{ fontSize: "14px" }}>
                        $
                        <div style={{ display: "none" }}>
                          {locations?.rideType === "oneway-trip" ||
                          locations?.rideType === "round-trip" ? (
                            parseFloat(vehicles[0]?.baseDistance) > totalKms ? (
                              (ggtotal =
                                parseFloat(vehicles[0]?.basePrice) +
                                nightCharge)
                            ) : (
                              (ggtotal =
                                (Math.round(parseInt(totalKms)) -
                                  parseFloat(vehicles[0]?.baseDistance)) *
                                  parseFloat(
                                    vehicles[0]?.pricePerUnitDistance
                                  ) +
                                parseFloat(vehicles[0]?.basePrice) +
                                parseFloat(nightCharge))
                            )
                          ) : locations.rideType === "hourly-trip" ? (
                            <>
                              {meetAndGreet === "No"
                                ? isBetween
                                  ? (ggtotal =
                                      parseFloat(locations.hour) *
                                        parseFloat(
                                          vehicles[0]?.pricePerUnitHour
                                        ) +
                                      nightCharge)
                                  : (ggtotal =
                                      parseFloat(locations.hour) *
                                        parseFloat(
                                          vehicles[0]?.pricePerUnitHour
                                        ) +
                                      nightCharge)
                                : (ggtotal =
                                    parseFloat(locations.hour) *
                                      parseFloat(
                                        vehicles[0]?.pricePerUnitHour
                                      ) +
                                    nightCharge)}
                            </>
                          ) : null}
                        </div>
                        {(gratuty =
                          (parseFloat(ggtotal) * parseFloat(gratuityAmount)) /
                          100).toFixed(0)}
                        .00
                      </div>
                    </div>
                  }

                  <div className="d-flex justify-content-between">
                    <div style={{ fontSize: "14px", color: "#c59c6c" }}>
                      {tripType === 30 ? (
                        <div>Welcome discount</div>
                      ) : tripType === 20 ? (
                        <div>Trip discount</div>
                      ) : (
                        <div>Discount</div>
                      )}
                    </div>
                    <div style={{ fontSize: "14px", color: "#c59c6c" }}>
                      ${" "}
                      {tripType === 30
                        ? (discountValue = (
                            (parseFloat(ggtotal) + parseFloat(gratuty)) *
                            0.1
                          )
                            .toFixed(2)
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ","))
                        : tripType === 20
                        ? (discountValue = (30)
                            .toFixed(2)
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ","))
                        : (discountValue = (0)
                            .toFixed(2)
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ","))}
                    </div>
                  </div>

                  {customerData?.wallet_balance !== 0 &&
                    customerData?.wallet_balance !== undefined &&
                    customerData?.wallet_balance !== null && (
                      <div
                        className="d-flex flex-column justify-content-between mt-2 mb-2"
                        style={{
                          background: "#1e1e1e",
                          padding: "10px 15px",
                          borderRadius: "5px",
                        }}
                      >
                        <div className="d-flex justify-content-between gap-2 align-items-center">
                          <small>
                            You have <b> $ {customerData?.wallet_balance}</b> on
                            your Wallet. Would you like to use it?
                          </small>
                          <small
                            style={{
                              background:
                                walletBalance === 0 ? "#c29c66" : "red",
                              cursor: "pointer",
                              padding: "5px 10px",
                              borderRadius: "5px",
                            }}
                            onClick={() =>
                              walletBalance === 0
                                ? setWalletBalance(customerData?.wallet_balance)
                                : setWalletBalance(0)
                            }
                          >
                            {walletBalance === 0 ? "Apply" : "Remove"}
                          </small>
                        </div>
                      </div>
                    )}

                  {voucherData.map(
                    (res, i) =>
                      res.amount !== 0 &&
                      res.amount !== undefined &&
                      res.amount !== null && (
                        <div
                          className="d-flex justify-content-between mt-2 mb-2 align-items-center"
                          style={{
                            // background: "#1e1e1e",
                            padding: "10px 15px",
                            borderRadius: "5px",
                          }}
                        >
                          <BiSolidOffer
                            style={{
                              color: "rgb(255, 213, 164)",
                              width: "30px",
                              height: "30px",
                            }}
                          />
                          <div className="d-flex flex-column">
                            <b>Referral Offer</b>
                            <small>save upto $25</small>
                          </div>{" "}
                          {referalOfferValue === 0 ? (
                            <div
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                setVoucherCode(res?.referal_code);
                                setReferalOfferValue(referalOfferValue - 25);
                              }}
                            >
                              Apply
                            </div>
                          ) : (
                            <div
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                setVoucherCode("");
                                setReferalOfferValue(referalOfferValue - 25);
                              }}
                            >
                              Remove
                            </div>
                          )}
                        </div>
                      )
                  )}

                  <hr />
                  <div className="d-flex justify-content-between">
                    <div style={{ fontSize: "20px", fontWeight: "600" }}>
                      Total Fee
                    </div>
                    <div
                      className="text-end"
                      style={{ fontSize: "25px", fontWeight: "600" }}
                    >
                      <div style={{ display: "none" }}>
                        ${" "}
                        {(finalInvoiceAmount =
                          ggtotal +
                          gratuty +
                          calculateSumOfSeats() +
                          calculateMeetAndGreet() -
                          discountValue +
                          referalOfferValue).toFixed(0) -
                          referalOfferValue -
                          walletBalance}
                        .00
                      </div>
                      ${" "}
                      {rydeTypeState === "round-trip"
                        ? (finalInvoiceAmount =
                            finalInvoiceAmount.toFixed(0) * 2)
                        : (finalInvoiceAmount = finalInvoiceAmount.toFixed(0))}
                      .00
                    </div>
                  </div>

                  <Checkbox onChange={(value) => agreeTerms(value)}>
                    <div style={{ fontSize: "12px", fontWeight: "400" }}>
                      I have read and agree to the{" "}
                      <a
                        style={{ fontSize: "12px" }}
                        href="https://saywalimo.com/terms-of-service"
                        target="_blank"
                        rel="nofollow"
                      >
                        Terms &amp; Policies
                      </a>
                    </div>
                  </Checkbox>
                  <div className="mt-3">
                    <Button
                      variant="contained"
                      disabled={!isTermsAgreed}
                      style={{
                        background: !isTermsAgreed ? "grey" : "#C59C6C",
                        color: !isTermsAgreed ? "#bfbfbf" : "white",
                      }}
                      className="w-100"
                      onClick={() => makePaymentAction()}
                    >
                      CONTINUE
                    </Button>
                  </div>
                </div>
              ) : (
                <OrderSummarySkeleton />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ReviewBooking;
