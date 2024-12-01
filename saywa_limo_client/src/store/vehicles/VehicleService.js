import { GET_SINGLE_VEHICLE, GET_VEHICLE_LIST } from "../../const/ApiConst";
import { instance } from "../../const/ApiHeader";

export const getVehicles = async () => {
  const response = await instance.post(GET_VEHICLE_LIST);
  return response.data;
};

export const getSingleVehicle = async (vehicleData) => {
  const response = await instance.post(GET_SINGLE_VEHICLE, vehicleData);
 
  return response.data;
};

const vehicleService = {
  getVehicles,
  getSingleVehicle,
};

export default vehicleService;
