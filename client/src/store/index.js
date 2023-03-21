import { configureStore } from "@reduxjs/toolkit"
import authReducer from "../features/users/authSlice"
import userReducer from "../features/users/userSlice"

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
  },
})

export default store
