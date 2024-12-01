import {
  CANCEL_TRIP,
  GET_SINGLE_TRIP_DATA,
  NEW_ADMIN_TRIP,
  SEND_STATUS,
  UPDATE_TRIP_DRIVER,
} from "../../Const/ApiConst";
import { instance } from "../../Const/ApiHeader";

const newTripAdmin = async (tripdata) => {
  const response = await instance.post(NEW_ADMIN_TRIP, tripdata);
  return response.data;
};

const getSingleTrips = async (tripData) => {
  const response = await instance.post(GET_SINGLE_TRIP_DATA);
  return response.data;
};

const assignDriver = async (tripData) => {
  const response = await instance.post(UPDATE_TRIP_DRIVER, tripData);
  return response.data;
};

const cancelOrder = async (tripData) => {
  const response = await instance.post(CANCEL_TRIP, tripData);
  return response.data;
};
const sendStatus = async (tripData) => {
  const response = await instance.post(SEND_STATUS, tripData);
  return response.data;
};

const TripOrderService = {
  newTripAdmin,
  getSingleTrips,
  assignDriver,
  cancelOrder,
  sendStatus
};

export default TripOrderService;
