import { createSlice } from "@reduxjs/toolkit"
import { ADMIN_TOKEN_KEY } from "../../constants/constant"

const initialState = localStorage.getItem(ADMIN_TOKEN_KEY)

const adminAuthSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    setAdminAuth: (state) => localStorage.getItem(ADMIN_TOKEN_KEY),
    clearAdminAuth: (state) => null,
  },
})

export default adminAuthSlice.reducer
export const { setAdminAuth, clearAdminAuth } = adminAuthSlice.actions
