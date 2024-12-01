import {
  GET_SINGLE_VEHICLE,
  GET_VEHICLE_LIST,
  LIVE_SEARCH_VEHICLE_URL,
  UPDATE_VEHICLE_BASE_DISTANCE_OR_PRICE_PRICE_URL,
  UPDATE_VEHICLE_BASE_DISTANCE_PRICE_URL,
  UPDATE_VEHICLE_BASE_DISTANCE_URL,
} from "../../Const/ApiConst";
import { instance } from "../../Const/ApiHeader";

const getSingleVehicles = async (vehicleData) => {
  const response = await instance.get(GET_SINGLE_VEHICLE, vehicleData);
  return response.data;
};

const allVehicles = async () => {
  const response = await instance.post(GET_VEHICLE_LIST);
  return response.data.data;
};

const updateBaseDistance = async (data) => {
  const response = await instance.post(UPDATE_VEHICLE_BASE_DISTANCE_URL, data);
  return response.data;
};

const updatePriceDistance = async (data) => {
  const response = await instance.post(
    UPDATE_VEHICLE_BASE_DISTANCE_PRICE_URL,
    data
  );
  return response.data;
};

const updatePriceOrDistance = async (data) => {
  const response = await instance.post(
    UPDATE_VEHICLE_BASE_DISTANCE_OR_PRICE_PRICE_URL,
    data
  );
  return response.data;
};

const liveSearchVehicle = async (data) => {
  const response = await instance.post(LIVE_SEARCH_VEHICLE_URL, data);
  return response.data;
};

const VehicleService = {
  getSingleVehicles,
  allVehicles,
  updateBaseDistance,
  updatePriceDistance,
  updatePriceOrDistance,
  liveSearchVehicle,
};

export default VehicleService;
