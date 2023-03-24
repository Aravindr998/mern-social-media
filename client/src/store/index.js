import { configureStore } from "@reduxjs/toolkit"
import authReducer from "../features/users/authSlice"
import userReducer from "../features/users/userSlice"
import postReducer from "../features/posts/postSlice"

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    posts: postReducer,
  },
})

export default store
