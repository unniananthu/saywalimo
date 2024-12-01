import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeTabIndexState } from "../../store/Trips/TripSlice";
import { Button, CircularProgress } from "@mui/material";
import { setSingleVehicle } from "../../store/Vehicles/VehicleSlice";
import { IMAGE_BASE_URL } from "../../Const/ApiConst";
import { useJsApiLoader } from "@react-google-maps/api";

const center = { lat: 48.8584, lng: 2.2945 };
const libraries = ["places"];

function TripVehicleSelectionComponent() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: libraries,
  });

  const dispatch = useDispatch();

  const { tabIndexState } = useSelector((state) => state?.trips);

  const { isLoading, allVehicleList } = useSelector((state) => state?.vehicle);
  const { locations } = useSelector((state) => state?.places);
  const wayPointsList = useSelector((state) => state?.waypoints?.wayPoints);
  const [totalKms, setTotalKms] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [directionsResponse, setDirectionsResponse] = useState(null);

  useEffect(() => {
    calculateRoute();
  }, []);

  const calculateRoute = async () => {
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
        unitSystem: window.google.maps.UnitSystem.IMPERIAL,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (results, status) => {
        let totalKms = 0;
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

  const selectThisVehicle = (e) => {
    if (locations?.rideType === "Package") {
      const data = {
        ...locations,
        _id: e?._id,
        amount: e?.price,
      };
      console.log(data);

      dispatch(setSingleVehicle(data));
    } else {
      dispatch(setSingleVehicle(e));
    }
    dispatch(changeTabIndexState(tabIndexState + 1));
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        {isLoading ? (
          <CircularProgress />
        ) : (
          allVehicleList.map((res, i) => (
            <div key={i} className="p-2">
              <div>
                <img
                  src={IMAGE_BASE_URL + res?.images[0]}
                  style={{
                    objectFit: "contain",
                    borderRadius: "10px",
                  }}
                  width={200}
                  height={200}
                />
              </div>
              <div className="mt-1">
                <strong>{res?.vehicleName}</strong>
              </div>
              <div>{res?.vehicleNo}</div>
              <div>
                <ul>
                  <li>Max Bags - {res.maxBags}</li>
                  <li>Max Passengers - {res.maxPersons}</li>
                </ul>
              </div>
              <div className="text-center">
                <Button
                  size="small"
                  variant="contained"
                  color="success"
                  onClick={() => selectThisVehicle(res)}
                >
                  Select
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TripVehicleSelectionComponent;
