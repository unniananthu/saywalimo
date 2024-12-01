import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    authRefreshs: false
}

export const authRefreshSlice = createSlice({
    name: "authRefresh",
    initialState,
    reducers: {
        authRefresh: (state, action) => { 
            state.authRefreshs = action.payload
        }
    }
})

export const { authRefresh } = authRefreshSlice.actions

export default authRefreshSlice.reducer

