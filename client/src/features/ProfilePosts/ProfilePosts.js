import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import axios from "../../axios"
import { TOKEN_KEY } from "../../constants/constant"

const initialState = {
  loading: false,
  posts: [],
  error: "",
  total: 0,
}

export const fetchProfilePosts = createAsyncThunk(
  "profilePosts/fetchProfilePosts",
  (username) => {
    return axios
      .get(`/api/post/user/${username}`, {
        headers: { Authorization: localStorage.getItem(TOKEN_KEY) },
      })
      .then(({ data }) => data)
  }
)

// export const loadMorePosts = createAsyncThunk(
//   "posts/loadMorePosts",
//   (pageNumber) => {
//     return axios
//       .get(`/api/post/load?page=${pageNumber}`, {
//         headers: { Authorization: localStorage.getItem(TOKEN_KEY) },
//       })
//       .then(({ data }) => data)
//   }
// )

const profilePostSlice = createSlice({
  name: "profilePosts",
  initialState,
  reducers: {
    addProfilePost: (state, action) => {
      state.posts.unshift(action.payload)
    },
    editProfilePost: (state, action) => {
      state.posts = state.posts.map((item) => {
        if (item._id === action.payload._id) return action.payload
        else return item
      })
    },
    deleteProfilePost: (state, action) => {
      state.posts = state.posts.filter(
        (item) => item._id !== action.payload._id
      )
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchProfilePosts.pending, (state) => {
      state.loading = true
    })
    builder.addCase(fetchProfilePosts.fulfilled, (state, action) => {
      state.loading = false
      state.posts = action.payload.posts
      state.error = ""
      state.total = action.payload.totalCount
    })
    builder.addCase(fetchProfilePosts.rejected, (state, action) => {
      state.loading = false
      state.posts = []
      state.error = action.error.message
    })
    // builder.addCase(loadMorePosts.pending, (state) => {
    //   state.loading = true
    // })
    // builder.addCase(loadMorePosts.fulfilled, (state, action) => {
    //   state.loading = false
    //   state.posts = [...state.posts, ...action.payload]
    //   state.error = ""
    // })
    // builder.addCase(loadMorePosts.rejected, (state, action) => {
    //   state.loading = false
    //   state.error = action.error.message
    // })
  },
})

export default profilePostSlice.reducer
export const { addProfilePost, editProfilePost, deleteProfilePost } =
  profilePostSlice.actions
