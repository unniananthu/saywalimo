import { configureStore } from "@reduxjs/toolkit";
import locationReducer from "./Places";
import vehicleReducer from "./vehicles/VehicleSlice";
import singleVehicleReducer from "./vehicles/SingleVehicleSlice";
import SelectedVehicleReducer from "./SelectedVehicleSlice";
import WaypointReducer from "./WaypointSlice";
import orderReducer from "./orders/OrderSlice";
import authRefreshReducer from "./AuthStateSlice";
import customerReducer from "./customers/CustomerSlice";
import activeStepReducer from "./StepperSlice";
import singleOrderReducer from "./orders/SingleOrderSlice";
import packageReducer from "./Packages/PackageSlice";

export const store = configureStore({
  reducer: {
    locations: locationReducer,
    vehicles: vehicleReducer,
    selectedVehicle: SelectedVehicleReducer,
    singleVehicle: singleVehicleReducer,
    waypoints: WaypointReducer,
    orders: orderReducer,
    authRefresh: authRefreshReducer,
    customer: customerReducer,
    activeStep: activeStepReducer,
    singleOrder: singleOrderReducer,
    package: packageReducer,
  },
});
