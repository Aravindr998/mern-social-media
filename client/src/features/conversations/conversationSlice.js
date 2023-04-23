import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "../../axios"
import { TOKEN_KEY } from "../../constants/constant"

const initialState = {
  loading: false,
  conversations: [],
  error: "",
}

export const fetchCoversations = createAsyncThunk(
  "conversations/fetchConversations",
  () => {
    return axios
      .get("/api/conversation", {
        headers: { Authorization: localStorage.getItem(TOKEN_KEY) },
      })
      .then(({ data }) => data)
  }
)

const conversationSlice = createSlice({
  name: "conversations",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchCoversations.pending, (state) => {
      state.loading = true
    })
    builder.addCase(fetchCoversations.fulfilled, (state, action) => {
      state.loading = false
      state.conversations = action.payload
      state.error = ""
    })
    builder.addCase(fetchCoversations.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message
    })
  },
})

export default conversationSlice.reducer
