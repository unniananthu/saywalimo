import { configureStore } from "@reduxjs/toolkit";
import tripReducer from "../store/Trips/TripSlice";
import vehicleReducer from "../store/Vehicles/VehicleSlice";
import customerReducer from "../store/Customers/CustomerSlice";
import placesReducer from "../store/Places/Places";
import waypointReducer from "../store/WaypointSlice";
import userReducer from "../store/Users/UserSlice";
import toastReducer from "./toast";
import menuStateReducer from "./SideMenu/SideMenuState";
import packageReducer from "./Packages/PackageSlice";

export const store = configureStore({
  reducer: {
    trips: tripReducer,
    vehicle: vehicleReducer,
    customer: customerReducer,
    places: placesReducer,
    waypoints: waypointReducer,
    users: userReducer,
    toast: toastReducer,
    menuState: menuStateReducer,
    packages: packageReducer,
  },
});
