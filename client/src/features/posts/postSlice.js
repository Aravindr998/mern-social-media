import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "../../axios"
import { TOKEN_KEY } from "../../constants/constant"

const initialState = {
  loading: false,
  posts: [],
  error: "",
  total: 0,
}

export const fetchPosts = createAsyncThunk("posts/fetchPosts", () => {
  return axios
    .get("/api/post", {
      headers: { Authorization: localStorage.getItem(TOKEN_KEY) },
    })
    .then(({ data }) => data)
})

export const loadMorePosts = createAsyncThunk(
  "posts/loadMorePosts",
  (pageNumber) => {
    return axios
      .get(`/api/post/load?page=${pageNumber}`, {
        headers: { Authorization: localStorage.getItem(TOKEN_KEY) },
      })
      .then(({ data }) => data)
  }
)

export const fetchSavedPosts = createAsyncThunk(
  "posts/fetchSavedPosts",
  async () => {
    const { data } = await axios.get("/api/post/saved/posts", {
      headers: { Authorization: localStorage.getItem(TOKEN_KEY) },
    })
    return data
  }
)

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    addPost: (state, action) => {
      state.posts.unshift(action.payload)
    },
    editPost: (state, action) => {
      state.posts = state.posts.map((item) => {
        if (item._id === action.payload._id) return action.payload
        else return item
      })
    },
    deletePost: (state, action) => {
      state.posts = state.posts.filter(
        (item) => item._id !== action.payload._id
      )
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchPosts.pending, (state) => {
      state.loading = true
    })
    builder.addCase(fetchPosts.fulfilled, (state, action) => {
      state.loading = false
      state.posts = action.payload.posts
      state.error = ""
      state.total = action.payload.totalCount
    })
    builder.addCase(fetchPosts.rejected, (state, action) => {
      state.loading = false
      state.posts = []
      state.error = action.error.message
    })
    builder.addCase(loadMorePosts.pending, (state) => {
      state.loading = true
    })
    builder.addCase(loadMorePosts.fulfilled, (state, action) => {
      state.loading = false
      state.posts = [...state.posts, ...action.payload]
      state.error = ""
    })
    builder.addCase(loadMorePosts.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message
    })
    builder.addCase(fetchSavedPosts.pending, (state) => {
      state.loading = true
    })
    builder.addCase(fetchSavedPosts.fulfilled, (state, action) => {
      state.loading = false
      state.posts = action.payload
      state.error = ""
      // state.total = action.payload.totalCount
    })
    builder.addCase(fetchSavedPosts.rejected, (state, action) => {
      state.loading = false
      state.posts = []
      state.error = action.error.message
    })
  },
})

export default postSlice.reducer
export const { addPost, editPost, deletePost } = postSlice.actions
