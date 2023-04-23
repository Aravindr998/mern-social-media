import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "../../axios"
import { TOKEN_KEY } from "../../constants/constant"

const initialState = {
  loading: false,
  messages: {},
  error: "",
}

export const fetchMessages = createAsyncThunk(
  "messages/fetchMessages",
  (conversationId) => {
    return axios
      .get(`/api/conversation/${conversationId}`, {
        headers: { Authorization: localStorage.getItem(TOKEN_KEY) },
      })
      .then(({ data }) => data)
  }
)

const messageSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    addMessage: (state, action) => {
      state.messages.messages.push(action.payload)
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMessages.pending, (state) => {
      state.loading = true
    })
    builder.addCase(fetchMessages.fulfilled, (state, action) => {
      state.loading = false
      state.messages = action.payload
      state.error = ""
    })
    builder.addCase(fetchMessages.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message
    })
  },
})

export default messageSlice.reducer
export const { addMessage } = messageSlice.actions
