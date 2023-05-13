import { createSlice } from "@reduxjs/toolkit"
import authSlice from "../users/authSlice"

const initialState = null

const tempAuthSlice = createSlice({
  name: "tempAuth",
  initialState,
  reducers: {
    setTempAuth: (state, action) => action.payload,
    clearTempAuth: (state) => null,
  },
})

export default tempAuthSlice.reducer
export const { setTempAuth, clearTempAuth } = tempAuthSlice.actions
