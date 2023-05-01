import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axios from "../../axios"
import { TOKEN_KEY } from "../../constants/constant"

const initialState = {
  loading: false,
  comments: [],
  error: "",
}

export const fetchComments = createAsyncThunk(
  "comments/fetchComments",
  async (postId) => {
    const { data } = await axios.get(`/api/post/${postId}/comments`, {
      headers: { Authorization: localStorage.getItem(TOKEN_KEY) },
    })
    return data
  }
)

export const fetchMoreComments = createAsyncThunk(
  "comments/fetchMoreComments",
  async ({ postId, page }) => {
    const { data } = await axios.get(
      `/api/post/${postId}/comments?page=${page}`,
      { headers: { Authorization: localStorage.getItem(TOKEN_KEY) } }
    )
    return data
  }
)

const commentSlice = createSlice({
  name: "comments",
  initialState,
  reducers: {
    addComment: (state, action) => {
      state.comments.push(action.payload)
    },
    deleteComment: (state, action) => {
      state.comments = state.comments.filter(
        (item) => item._id !== action.payload._id
      )
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchComments.pending, (state) => {
      state.loading = true
    })
    builder.addCase(fetchComments.fulfilled, (state, action) => {
      state.loading = false
      state.comments = action.payload
      state.error = ""
    })
    builder.addCase(fetchComments.rejected, (state, action) => {
      state.loading = false
      state.comments = []
      state.error = action.error.message
    })
    builder.addCase(fetchMoreComments.pending, (state) => {
      state.loading = true
    })
    builder.addCase(fetchMoreComments.fulfilled, (state, action) => {
      state.loading = false
      state.comments = [...action.payload, ...state.comments]
      state.error = ""
    })
    builder.addCase(fetchMoreComments.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message
    })
  },
})

export default commentSlice.reducer

export const { addComment, deleteComment } = commentSlice.actions
