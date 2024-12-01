import {
  CANCEL_TRIP_DATA,
  GET_TRIP_DATA,
  NEW_TRIP,
  SINGLE_TRIP_DATA,
} from "../../const/ApiConst";
import { instance } from "../../const/ApiHeader";

export const newOrder = async (orderData) => {
  const response = await instance.post(NEW_TRIP, orderData);
  return response.data;
};

export const getOrder = async (orderData) => {
  const response = await instance.post(GET_TRIP_DATA, orderData);
  return response.data;
};

export const canceltOrder = async (orderData) => {
  const response = await instance.post(CANCEL_TRIP_DATA, orderData);
  return response.data;
};

export const singleOrder = async (orderData) => {
  const response = await instance.post(SINGLE_TRIP_DATA, orderData);
  return response.data.data;
};

const orderService = {
  newOrder,
  getOrder,
  canceltOrder,
  singleOrder,
};

export default orderService;
