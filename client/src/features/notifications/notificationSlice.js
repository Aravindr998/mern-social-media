import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "../../axios"
import { TOKEN_KEY } from "../../constants/constant"

const initialState = {
  loading: false,
  notifications: [],
  error: "",
  total: 0,
}

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async () => {
    const { data } = await axios.get("/api/notifications/", {
      headers: { Authorization: localStorage.getItem(TOKEN_KEY) },
    })
    return data
  }
)

export const loadMoreNotifications = createAsyncThunk(
  "notifications/loadMoreNotifications",
  async (pageNumber) => {
    const { data } = await axios.get(`/api/post/load?page=${pageNumber}`, {
      headers: { Authorization: localStorage.getItem(TOKEN_KEY) },
    })
    return data
  }
)

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchNotifications.pending, (state) => {
      state.loading = true
    })
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      state.loading = false
      state.notifications = action.payload
      state.error = ""
      state.total = action.payload.totalCount
    })
    builder.addCase(fetchNotifications.rejected, (state, action) => {
      state.loading = false
      state.notifications = []
      state.error = action.error.message
    })
    builder.addCase(loadMoreNotifications.pending, (state) => {
      state.loading = true
    })
    builder.addCase(loadMoreNotifications.fulfilled, (state, action) => {
      state.loading = false
      state.notifications = [...state.notifications, ...action.payload]
      state.error = ""
    })
    builder.addCase(loadMoreNotifications.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message
    })
  },
})

export default notificationSlice.reducer
