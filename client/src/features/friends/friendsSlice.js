import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "../../axios"
import { TOKEN_KEY } from "../../constants/constant"

const initialState = {
  loading: false,
  friends: [],
  error: "",
}

export const fetchFriends = createAsyncThunk(
  "friends/fetchFriends",
  async () => {
    const { data } = await axios.get("/api/friends", {
      headers: { Authorization: localStorage.getItem(TOKEN_KEY) },
    })
    return data
  }
)

const friendsSlice = createSlice({
  name: "friends",
  initialState,
  reducers: {
    removeFriends: (state, action) => {
      state.friends = state.friends.filter(
        (item) => item._id.toString() !== action.payload.toString()
      )
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchFriends.pending, (state) => {
      state.loading = true
    })
    builder.addCase(fetchFriends.fulfilled, (state, action) => {
      state.loading = false
      state.friends = action.payload
      state.error = ""
    })
    builder.addCase(fetchFriends.rejected, (state, action) => {
      state.loading = false
      state.friends = []
      state.error = action.error.message
    })
  },
})

export default friendsSlice.reducer

export const { removeFriends } = friendsSlice.actions
