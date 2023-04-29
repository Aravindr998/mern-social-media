import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "../../axios"
import { ADMIN_TOKEN_KEY } from "../../constants/constant"

const initialState = {
  loading: false,
  users: [],
  error: "",
}

export const fetchAllUsers = createAsyncThunk("allUsers/fetchAllUsers", () => {
  return axios
    .get("/api/admin/users", {
      headers: { Authorization: localStorage.getItem(ADMIN_TOKEN_KEY) },
    })
    .then(({ data }) => data)
})

const allUsersSlice = createSlice({
  name: "allUsers",
  initialState,
  reducers: {
    editUserList: (state, action) => {
      state.users = state.users.map((item) => {
        if (item._id === action.payload._id) {
          return action.payload
        }
        return item
      })
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllUsers.pending, (state) => {
      state.loading = true
    })
    builder.addCase(fetchAllUsers.fulfilled, (state, action) => {
      state.loading = false
      state.users = action.payload
      state.error = ""
    })
    builder.addCase(fetchAllUsers.rejected, (state, action) => {
      state.loading = false
      state.users = []
      state.error = action.error.message
    })
  },
})

export default allUsersSlice.reducer
export const { editUserList } = allUsersSlice.actions
