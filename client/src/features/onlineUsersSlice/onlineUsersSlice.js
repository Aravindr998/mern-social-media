import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "../../axios"
import { TOKEN_KEY } from "../../constants/constant"

const initialState = {
  loading: false,
  users: [],
  error: "",
}

export const fetchOnlineUsers = createAsyncThunk(
  "onlineUsers/fetchOnlineUsers",
  async () => {
    const { data } = await axios.get(`/api/users/online`, {
      headers: { Authorization: localStorage.getItem(TOKEN_KEY) },
    })
    return data
  }
)

const onlineUsersSlice = createSlice({
  name: "onlineUsers",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchOnlineUsers.pending, (state) => {
      state.loading = true
    })
    builder.addCase(fetchOnlineUsers.fulfilled, (state, action) => {
      state.loading = false
      state.users = action.payload
      state.error = ""
    })
    builder.addCase(fetchOnlineUsers.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message
    })
  },
})

export default onlineUsersSlice.reducer
