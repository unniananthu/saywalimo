import { PACKAGES_URL } from "../../Const/ApiConst";
import { imageInstance, instance } from "../../Const/ApiHeader";

const getAllPackages = async () => {
  const response = await instance.get(`${PACKAGES_URL}/`);
  return response.data;
};

const newPackages = async (data) => {
  const response = await imageInstance.post(`${PACKAGES_URL}/new`, data);
  return response.data;
};

const toggleStatus = async (data) => {
  const response = await instance.post(`${PACKAGES_URL}/toggle-status`, data);
  return response.data;
};

const getSinglePackage = async (data) => {
  const response = await instance.post(`${PACKAGES_URL}/get-single`, data);
  return response.data;
};

const liveSearchPackage = async (data) => {
  const response = await instance.post(`${PACKAGES_URL}/live-search`, data);
  return response.data;
};

const deleteImagePackage = async (data) => {
  const response = await instance.post(`${PACKAGES_URL}/delete-img`, data);
  return response.data;
};

const packageService = {
  getAllPackages,
  newPackages,
  toggleStatus,
  getSinglePackage,
  liveSearchPackage,
  deleteImagePackage,
};

export default packageService;
