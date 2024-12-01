import { PACKAGES_URL } from "../../const/ApiConst";
import { instance } from "../../const/ApiHeader";

export const getActivePackages = async () => {
  const response = await instance.post(`${PACKAGES_URL}/get-active`);
  return response.data;
};

export const getSinglePackage = async (data) => {
  const response = await instance.post(`${PACKAGES_URL}/get-single`, data);
  return response.data;
};

const PackageServices = {
  getActivePackages,
  getSinglePackage,
};

export default PackageServices;
