import {
  ALL_CLIENTS,
  CLIENT_UPDATE,
  DELETE_USER,
  LIVE_CUSTOMER,
} from "../../Const/ApiConst";
import { instance } from "../../Const/ApiHeader";

const getAllCustomers = async (customerData) => {
  const response = await instance.post(ALL_CLIENTS, customerData);
  return response.data;
};

const getLiveCustomers = async (customerData) => {
  const response = await instance.post(LIVE_CUSTOMER, customerData);
  return response.data;
};

const updateCustomers = async (customerData) => {
  const response = await instance.post(CLIENT_UPDATE, customerData);
  return response.data;
};

const deleteCustomers = async (customerData) => {
  const response = await instance.post(DELETE_USER, customerData);
  return response.data;
};

const customerService = {
  getAllCustomers,
  getLiveCustomers,
  updateCustomers,
  deleteCustomers,
};

export default customerService;
