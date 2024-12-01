import React, { useState, useEffect, useCallback } from "react";
import {
  GoogleMap,
  DirectionsRenderer,
  useJsApiLoader,
  Marker,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
};

const center = {
  lat: 37.7749,
  lng: -122.4194,
};

const MapWithDirections = () => {
  const { isLoaded, loadError } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  const [directions, setDirections] = useState(null);
  const [origin, setOrigin] = useState("San Francisco, CA");
  const [destination, setDestination] = useState("Los Angeles, CA");

  useEffect(() => {
    if (isLoaded && !loadError) {
      const directionsService = new window.google.maps.DirectionsService();
      const directionsRenderer = new window.google.maps.DirectionsRenderer({
        draggable: true,
        map: null, // render the route on a separate map initially
      });

      const updateDirections = () => {
        directionsService.route(
          {
            origin: origin,
            destination: destination,
            travelMode: "DRIVING",
          },
          (result, status) => {
            if (status === "OK") {
              setDirections(result);
            } else {
              console.error(`Error fetching directions ${result}`);
            }
          }
        );
      };

      updateDirections(); // Initial route

      directionsRenderer.setMap(null); // Remove the initial rendering
      directionsRenderer.setMap(directionsRenderer.getMap()); // Re-add the rendering with the draggable option

      const map = new window.google.maps.Map(document.createElement("div"));

      directionsRenderer.setMap(map);

      window.google.maps.event.addListener(
        directionsRenderer,
        "directions_changed",
        () => {
          setDirections(directionsRenderer.getDirections());
        }
      );
    }
  }, [isLoaded, loadError, origin, destination]);

  const [selectedMarker, setSelectedMarker] = useState("start");

  const onMapClick = (e) => {
    // Update the destination when the map is clicked
    if (selectedMarker === "start") {
      setOrigin(`${e.latLng.lat()}, ${e.latLng.lng()}`);
    } else if (selectedMarker === "end") {
      setDestination(`${e.latLng.lat()}, ${e.latLng.lng()}`);
    }
  };

  return isLoaded ? (
    <div className="row">
      <div className="col-9">
        <GoogleMap
          mapContainerStyle={containerStyle}
          draggable={true}
          options={{
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          center={center}
          zoom={8}
          onClick={onMapClick}
          // onDrag={(e) => console.log(e)}
        >
          {directions && <DirectionsRenderer directions={directions} />}
        </GoogleMap>
      </div>
      <div className="col-3">
        <ul>
          <li onClick={() => setSelectedMarker("start")}>
            {selectedMarker}
            Start Location : {origin}
          </li>
          <li onClick={() => setSelectedMarker("end")}>
            End Location {destination}
          </li>
        </ul>
      </div>
    </div>
  ) : null;
};

export default MapWithDirections;
