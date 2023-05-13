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
import profilePostReducer from "../features/ProfilePosts/ProfilePosts"
import friendsReducer from "../features/friends/friendsSlice"
import appearanceReducer from "../features/appearance/appearanceSlice"
import offerReducer from "../features/offer/offerSlice"
import adminDashboardReducer from "../features/adminDashboard/adminDashboardSlice"
import tempAuthReducer from "../features/tempAuth/tempAuth"

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
    profilePosts: profilePostReducer,
    friends: friendsReducer,
    appearance: appearanceReducer,
    offer: offerReducer,
    adminDashboard: adminDashboardReducer,
    tempAuth: tempAuthReducer,
  },
})

export default store
