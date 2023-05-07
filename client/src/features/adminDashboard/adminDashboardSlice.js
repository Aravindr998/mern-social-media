import { createSlice } from "@reduxjs/toolkit"

const initialState = new Date().getMonth()

const adminDashboardSlice = createSlice({
  name: "adminDashboard",
  initialState,
  reducers: {
    setDate: (state, action) => action.payload,
  },
})

export const { setDate } = adminDashboardSlice.actions

export default adminDashboardSlice.reducer
