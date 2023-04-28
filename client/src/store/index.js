import { configureStore } from "@reduxjs/toolkit"
import authReducer from "../features/users/authSlice"
import userReducer from "../features/users/userSlice"
import postReducer from "../features/posts/postSlice"
import conversationReducer from "../features/conversations/conversationSlice"
import messageReducer from "../features/messages/messageSlice"
import allUsersReducer from "../features/allUsersSlice/allUsersSlice"
import adminAuthReducer from "../features/adminAuth/adminAuthSlice"
import commentReducer from "../features/comments/commentSlice"
import onlineUsersReducer from "../features/onlineUsersSlice/onlineUsersSlice"
import notificationReducer from "../features/notifications/notificationSlice"

const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    posts: postReducer,
    conversations: conversationReducer,
    messages: messageReducer,
    allUsers: allUsersReducer,
    adminAuth: adminAuthReducer,
    comments: commentReducer,
    onlineUsers: onlineUsersReducer,
    notifications: notificationReducer,
  },
})

export default store
