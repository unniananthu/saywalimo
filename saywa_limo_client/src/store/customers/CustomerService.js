import { GET_CUSTOMER } from "../../const/ApiConst"
import { instance } from "../../const/ApiHeader"

export const customerData = async (custData) => {
    const response = await instance.post(GET_CUSTOMER, custData)
    return response.data
}

const customerService = {
    customerData
}

export default customerService