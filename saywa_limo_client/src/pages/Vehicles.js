import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getVehicles } from "../store/vehicles/VehicleSlice";
import TrendingFlatIcon from "@mui/icons-material/TrendingFlat";
import { location } from "../store/Places";
import {
  DirectionsRenderer,
  GoogleMap,
  Polyline,
  useJsApiLoader,
} from "@react-google-maps/api";
import { IMAGE_BASE_URL } from "../const/ApiConst";
import { Box, Button, Modal, Skeleton } from "@mui/material";
import { selectedVehicle } from "../store/SelectedVehicleSlice";
import "./Vehicles.css";
import { GiPathDistance } from "react-icons/gi";
import { FaMoneyCheckDollar } from "react-icons/fa6";
import Cookies from "js-cookie";
import Login from "../components/login/Login";
import { activeStepx } from "../store/StepperSlice";
import { wayPoints } from "../store/WaypointSlice";
import { LuBaggageClaim } from "react-icons/lu";
import { FaPeopleGroup } from "react-icons/fa6";

const center = { lat: 48.8584, lng: 2.2945 };
const libraries = ["places"];
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 2,
};

function Vehicles() {
  // ----------------------------------[Map Configurations]----------------------------------
  const mapOptions = {
    language: "en", // Set the desired language code
    region: "us",
  };

  // ----------------------------------[Load Map Data]----------------------------------
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });

  // ----------------------------------[State Hooks]----------------------------------

  const [directionsResponse, setDirectionsResponse] = useState(null);
  const [totalKms, setTotalKms] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [nightCharge, setNightCharge] = useState(0);
  const [tripType, setTripType] = useState(0);
  const [TimeType, setTimeType] = useState("Day");
  const [openModal, setOpenModal] = React.useState(false);
  const [polylinePaths, setPolylinePaths] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(0);
  const [routeNo, setRouteNo] = useState(0);
  // ----------------------------------[Store]----------------------------------

  const { locations } = useSelector((state) => state?.locations);
  const wayPointsList = useSelector((state) => state?.waypoints?.wayPoints);
  const { isLoading, data } = useSelector((state) => state?.vehicles?.vehicles);
  const { authRefreshs } = useSelector((state) => state?.authRefresh);

  const dispatch = useDispatch();
  // ----------------------------------[Useeffects]----------------------------------

  // --------[Load Default Data]--------
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Optional: Add smooth scrolling animation
    });
    if (locations.length === 0) {
      const data = JSON.parse(sessionStorage.getItem("locationData"));
      dispatch(location(data));
    }

    if (wayPointsList?.length === 0) {
      const data = JSON.parse(sessionStorage.getItem("waypoints"));
      dispatch(wayPoints(data));
    }
    // eslint-disable-next-line
  }, []);

  // ----------------------------------[Check Night]----------------------------------

  useEffect(() => {
    checkNight();
  }, []);

  // ----------------------------------[Modal Default State]----------------------------------
  useEffect(() => {
    if (authRefreshs) {
      handleCloseModal();
    }
  }, [authRefreshs]);

  // ----------------------------------[Load Vehicles]----------------------------------
  useEffect(() => {
    dispatch(getVehicles());
    // eslint-disable-next-line
  }, []);

  // ----------------------------------[Load Directions & Calulations]----------------------------------
  useEffect(() => {
    if (locations.rideType !== "hourly-trip") {
      const loadMapData = async () => {
        const waypointData = wayPointsList?.map((element) => ({
          location: element.content,
          stopover: true,
        }));

        const directionsService = new window.google.maps.DirectionsService(); // Create the DirectionsService object

        directionsService.route(
          {
            origin: locations?.source,
            destination: locations?.destination,
            waypoints: waypointData,
            optimizeWaypoints: true,
            // draggable: false,
            provideRouteAlternatives: true,
            avoidFerries: true,
            unitSystem: window.google.maps.UnitSystem.IMPERIAL,
            travelMode: window.google.maps.TravelMode.DRIVING,
          },
          (results, status) => {
            let totalKms = 0;
            let totalTime = 0;

            setRouteNo(results?.routes.length - 1);

            results?.routes[results?.routes.length - 1].legs.forEach(
              (leg, i) => {
                totalKms += parseFloat(leg.distance.value);
                totalTime += parseFloat(leg.duration.value);
              }
            );

            setTotalKms((totalKms / 1000) * 0.621371);
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
  // ----------------------------------[Check Night]----------------------------------

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

  // ----------------------------------[Modal Action]----------------------------------

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  // ----------------------------------[Book Trip]----------------------------------
  const bookTripAction = (e) => {
    if (
      Cookies.get("udtl") === "" ||
      Cookies.get("udtl") === undefined ||
      Cookies.get("udtl") === null
    ) {
      handleOpenModal();
      return;
    }

    const data = {
      ...locations,
      travelLength: parseFloat(totalKms).toFixed(1),
    };

    dispatch(location(data));

    dispatch(selectedVehicle(e));

    dispatch(activeStepx(1));
  };

  // ----------------------------------[Change Route Distance]----------------------------------

  const changeRouteDistance = (iii) => {
    setSelectedRoute(iii);
    const data = {
      ...locations,
      routeNo: iii,
    };

    dispatch(location(data));
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
        // draggable: true,
        avoidFerries: true,
        provideRouteAlternatives: true,
        unitSystem: window.google.maps.UnitSystem.IMPERIAL,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (results) => {
        let totalKms = 0;
        let totalTime = 0;
        results?.routes[iii].legs.forEach((leg, i) => {
          totalKms += parseFloat(leg.distance.value);
          totalTime += parseFloat(leg.duration.value);
        });
        setTotalKms((totalKms / 1000) * 0.621371);
        setTotalTime(totalTime);
      }
    );
  };

  // ----------------------------------[Return if Map not Loaded]----------------------------------
  if (!isLoaded) {
    return <div>Loading...</div>; // Or any loading indicator
  }

  return (
    <div className="container mb-2">
      <div
        className="trip-container "
        style={{
          color: "white",
          background: "linear-gradient(90deg, #493d2f, #b69876)",
          padding: "10px",
          borderRadius: "10px",
        }}
      >
        <div className="mt-2" style={{ fontSize: "20px", fontWeight: "bold" }}>
          {locations?.source}
          {locations.rideType !== "hourly-trip" ? (
            <>
              <TrendingFlatIcon /> {locations?.destination}
            </>
          ) : (
            ""
          )}
        </div>
        <div className="d-flex gap-2 mb-3 align-items-center w-100">
          <div>{locations?.pickupDate}</div>
          {locations.rideType !== "hourly-trip" ? (
            <>
              <small>
                {Math.floor(totalTime / 3600) +
                  " hr " +
                  ((totalTime % 3600) / 60).toFixed(0) +
                  " mins"}
              </small>
              <small>{totalKms.toFixed(2)} Mile(s) </small>
            </>
          ) : (
            <small>{locations.hour} Hour(s) </small>
          )}
        </div>
      </div>
      <div className="p-2" />
      {locations.rideType !== "hourly-trip" ? (
        <div className="vehStopContainer">
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
                  options: mapOptions,
                }}
              >
                {/* {waypoints.map((waypoint, index) => (
                  <Marker
                    key={index}
                    position={waypoint.location}
                    draggable={true}
                    onDragEnd={onMarkerDragEnd}
                  />
                ))} */}

                {/* Render polylines */}

                <Polyline
                  path={polylinePaths[polylinePaths.length - 1]}
                  options={{
                    strokeWeight: 5,
                    strokeOpacity: 1,
                    // zIndex: i === selectedRoute ? 999 : 1,
                    // strokeColor: i === selectedRoute ? "black" : "grey",
                    strokeColor: "black",
                  }}
                  draggable={false}
                  // onClick={() => {
                  //   changeRouteDistance(i);
                  // }}
                />

                {/* {polylinePaths.map((path, i) => (
                  <Polyline
                    key={i}
                    path={path}
                    options={{
                      strokeWeight: 5,
                      strokeOpacity: 1,
                      zIndex: i === selectedRoute ? 999 : 1,
                      strokeColor: i === selectedRoute ? "black" : "grey",
                    }}
                    draggable={false}
                    // onClick={() => {
                    //   changeRouteDistance(i);
                    // }}
                  />
                ))} */}

                <DirectionsRenderer
                  // key={i}
                  directions={directionsResponse}
                  options={{
                    polylineOptions: {
                      strokeColor: "transparent",
                      strokeWeight: 0,
                      draggable: false,
                    },
                    // polylineOptions: {
                    //   zIndex: i === selectedRoute ? 999 : 1,
                    //   strokeColor: i === selectedRoute ? "black" : "grey",
                    //   strokeWeight: 1,
                    //   strokeOpacity: 1,
                    // },
                    routeIndex: 0,
                    draggable: false,
                  }}
                  draggable={false}
                  // onDirectionsChanged={(newDirections) =>
                  //   handleDirectionsChanged(newDirections, i)
                  // }
                />

                {/* {directionsResponse &&
                  directionsResponse.routes.map((routes, i) => (
                    <DirectionsRenderer
                      key={i}
                      directions={directionsResponse}
                      options={{
                        polylineOptions: {
                          strokeColor: "transparent",
                          strokeWeight: 0,
                          draggable: false,
                        },
                        // polylineOptions: {
                        //   zIndex: i === selectedRoute ? 999 : 1,
                        //   strokeColor: i === selectedRoute ? "black" : "grey",
                        //   strokeWeight: 1,
                        //   strokeOpacity: 1,
                        // },
                        routeIndex: i,
                        draggable: false,
                      }}
                      draggable={false}
                      // onDirectionsChanged={(newDirections) =>
                      //   handleDirectionsChanged(newDirections, i)
                      // }
                    />
                  ))} */}
              </GoogleMap>
            </div>
          </div>
          {wayPointsList?.length !== 0 ? (
            <div>
              <strong>Stops</strong>
              <ol type="A">
                <li
                  style={{
                    border: "1px solid grey",
                    padding: "10px",
                    borderRadius: "5px",
                    margin: "5px",
                  }}
                >
                  {locations?.source}
                </li>
                {wayPointsList?.map((res, i) => (
                  <li
                    style={{
                      border: "1px solid grey",
                      padding: "10px",
                      borderRadius: "5px",
                      margin: "5px",
                    }}
                    key={i}
                  >
                    {res.content}
                  </li>
                ))}
                <li
                  style={{
                    border: "1px solid grey",
                    padding: "10px",
                    borderRadius: "5px",
                    margin: "5px",
                  }}
                >
                  {locations?.destination}
                </li>
              </ol>
            </div>
          ) : (
            ""
          )}
        </div>
      ) : null}

      <div className="mt-4">
        <h5>Select Vehicle</h5>
        {isLoading ? (
          <div className="d-flex flex-column ">
            <div className="d-flex align-items-center justify-content-between trip-container mt-4">
              <div
                className="d-flex flex-column gap-0"
                style={{ width: "10%" }}
              >
                <Skeleton
                  animation="wave"
                  style={{
                    marginBottom: 6,
                    width: "150px",
                    height: "150px",
                  }}
                />
              </div>
              <div className="w-50">
                <div className="d-flex gap-4">
                  <Skeleton width={"100%"} />
                  <Skeleton width={"100%"} />
                </div>
                <div className="d-flex gap-4">
                  <Skeleton width={"100%"} />
                  <Skeleton width={"100%"} />
                </div>
              </div>
              <div style={{ width: "15%" }}>
                <Skeleton width={"100%"} />
                <Skeleton width={"100%"} />
              </div>
            </div>
            <div className="d-flex align-items-center justify-content-between trip-container mt-4">
              <div
                className="d-flex flex-column gap-0"
                style={{ width: "10%" }}
              >
                <Skeleton
                  animation="wave"
                  style={{
                    marginBottom: 6,
                    width: "150px",
                    height: "150px",
                  }}
                />
              </div>
              <div className="w-50">
                <div className="d-flex gap-4">
                  <Skeleton width={"100%"} />
                  <Skeleton width={"100%"} />
                </div>
                <div className="d-flex gap-4">
                  <Skeleton width={"100%"} />
                  <Skeleton width={"100%"} />
                </div>
              </div>
              <div style={{ width: "15%" }}>
                <Skeleton width={"100%"} />
                <Skeleton width={"100%"} />
              </div>
            </div>
          </div>
        ) : (
          data?.map((res, i) => (
            <div key={i} className="veh-dtls-container order-order-boxx">
              <div className="vhllistviewimagecontainer mr-2">
                <img
                  src={IMAGE_BASE_URL + res.images[0]}
                  alt=""
                  className="select-vehicle-image"
                  style={{
                    height: "150px",
                    width: "200px",
                    objectFit: "contain",
                  }}
                />
              </div>
              <div className="monbhiddss p-1  d-flex justify-content-center align-items-center gap-2">
                <div
                  style={{
                    fontSize: "20px",
                    fontWeight: "bold",
                    textAlign: "start",
                    width: "100%",
                  }}
                >
                  {res.vehicleName}
                </div>
                <div
                  className="text-secondary"
                  style={{
                    fontSize: "15px",
                    fontWeight: "300",
                    textAlign: "start",
                    width: "100%",
                  }}
                >
                  {res.feature}
                </div>
                <div
                  className="text-secondary"
                  style={{ textAlign: "start", width: "100%" }}
                >
                  <GiPathDistance /> &nbsp; Base Distance: {res.baseDistance}{" "}
                  Miles
                </div>
                <div
                  className="text-secondary"
                  style={{ textAlign: "start", width: "100%" }}
                >
                  <FaMoneyCheckDollar /> &nbsp; Rate after base distance: $
                  {res.pricePerUnitDistance}
                </div>
                <div className="d-flex gap-2 w-100">
                  <div className="d-flex align-items-center gap-1">
                    <FaPeopleGroup size={20} />
                    <div>{res.maxPersons}</div>
                  </div>
                  <div className="d-flex align-items-center gap-1">
                    <LuBaggageClaim />
                    <div> {res?.maxBags}</div>
                  </div>
                </div>
                <div className="d-flex justify-content-around align-items-center gap-3"></div>
              </div>
              <div className=" vhllstrgtcntr">
                {locations?.rideType === "oneway-trip" ? (
                  parseFloat(res.baseDistance) > totalKms ? (
                    <div style={{ fontSize: "25px", fontWeight: "600" }}>
                      ${" "}
                      {(parseFloat(res.basePrice) + nightCharge - tripType)
                        .toFixed(0)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </div>
                  ) : (
                    <div style={{ fontSize: "25px", fontWeight: "600" }}>
                      ${" "}
                      {(
                        (totalKms - parseFloat(res.baseDistance)) *
                          parseFloat(res.pricePerUnitDistance) +
                        parseFloat(res.basePrice) +
                        nightCharge
                      )
                        .toFixed(0)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </div>
                  )
                ) : locations?.rideType === "round-trip" ? (
                  parseFloat(res.baseDistance) > totalKms ? (
                    <div style={{ fontSize: "25px", fontWeight: "600" }}>
                      ${" "}
                      {(
                        (parseFloat(res.basePrice) + nightCharge - tripType) *
                        2
                      )
                        .toFixed(0)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </div>
                  ) : (
                    <div style={{ fontSize: "25px", fontWeight: "600" }}>
                      ${" "}
                      {(
                        ((totalKms - parseFloat(res.baseDistance)) *
                          parseFloat(res.pricePerUnitDistance) +
                          parseFloat(res.basePrice) +
                          nightCharge) *
                        2
                      )
                        .toFixed(0)
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </div>
                  )
                ) : null}
                {locations.rideType === "hourly-trip" ? (
                  <>
                    <div style={{ fontSize: "25px", fontWeight: "600" }}>
                      ${" "}
                      {TimeType === "Night"
                        ? (
                            parseFloat(locations.hour) *
                              parseFloat(res.pricePerUnitHour) +
                            20 -
                            tripType +
                            nightCharge
                          )
                            .toFixed(2)
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        : (
                            parseFloat(locations.hour) *
                              parseFloat(res.pricePerUnitHour) -
                            tripType +
                            nightCharge
                          )
                            .toFixed(2)
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </div>
                  </>
                ) : null}
                <Button
                  variant="contained"
                  onClick={() => bookTripAction(res._id)}
                  style={{
                    padding: "10px 20px",
                    fontWeight: "400",
                    background: "rgb(193, 155, 101)",
                  }}
                >
                  Select Vehicle
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Login />
        </Box>
      </Modal>
    </div>
  );
}

export default Vehicles;
