import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import customerService from "./CustomerService"

const initialState = {
    customers: [],
    isLoading: false,
    isError: false,
    isSuccess: false
}

export const getCustomer = createAsyncThunk(
    'get/customer',
    async (custData, thunkAPI) => {
        try {
            return await customerService.customerData(custData)
        } catch (error) {
            return thunkAPI.rejectWithValue(error)
        }
    }
)

export const customerSlice = createSlice({
    name: "customers",
    initialState,
    reducers: {},
    extraReducers: (builders) => {
        builders
            .addCase(getCustomer.pending, (state) => {
                state.isLoading = true
                state.isError = false
                state.isSuccess = false
            })
            .addCase(getCustomer.rejected, (state) => {
                state.isLoading = false
                state.isError = true
                state.isSuccess = false
            })
            .addCase(getCustomer.fulfilled, (state, action) => {
                state.isLoading = false
                state.isError = false
                state.isSuccess = true
                state.customers = action.payload
            })
    }
})

export default customerSlice.reducer