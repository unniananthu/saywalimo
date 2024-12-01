import { GET_DRIVERS_LIST } from "../../Const/ApiConst";
import { instance } from "../../Const/ApiHeader";

const getAllUsers = async () => {
  const response = await instance.get(GET_DRIVERS_LIST);
  return response.data.data;
};

export default { getAllUsers };
