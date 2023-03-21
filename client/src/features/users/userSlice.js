import axios from "../../axios"
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

const initialState = {
  loading: false,
  user: {},
  error: "",
}

export const fetchUser = createAsyncThunk("user/fetchUsers", () => {
  return axios.get("/user/details").then((response) => response.data)
})

const userSlice = createSlice({
  name: "user",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchUser.pending, (state) => {
      state.loading = true
    })
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.loading = false
      state.user = action.payload
      state.error = ""
    })
    builder.addCase(fetchUser.rejected, (state, action) => {
      state.loading = false
      state.users = []
      state.error = action.error.message
    })
  },
})

export default userSlice.reducer
