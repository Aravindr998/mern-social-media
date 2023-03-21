import { createSlice } from "@reduxjs/toolkit"
import { TOKEN_KEY } from "../../constants/constant"

const initialState = localStorage.getItem(TOKEN_KEY) || null

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state) => localStorage.getItem(TOKEN_KEY),
    clearAuth: (state) => null,
  },
})

export default authSlice.reducer
export const { setAuth, clearAuth } = authSlice.actions
