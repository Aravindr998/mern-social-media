import { configureStore } from "@reduxjs/toolkit"
import authReducer from "../features/users/authSlice"
import userReducer from "../features/users/userSlice"
import postReducer from "../features/posts/postSlice"
import conversationReducer from "../features/conversations/conversationSlice"
import messageReducer from "../features/messages/messageSlice"

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    posts: postReducer,
    conversations: conversationReducer,
    messages: messageReducer,
  },
})

export default store
