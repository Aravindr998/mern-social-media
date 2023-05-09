import "./App.css"
import LoginPage from "./pages/LoginPage"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import { defaultTheme } from "./theme/theme"
import { adminTheme } from "./theme/adminTheme"
import { Routes, Route, useParams, useLocation } from "react-router-dom"
import SignupPage from "./pages/SignupPage"
import OtpPage from "./pages/OtpPage"
import { useEffect, useState } from "react"
import axios from "./axios"
import { useDispatch, useSelector } from "react-redux"
import { setUser } from "./features/users/userSlice"
import HomePage from "./pages/HomePage"
import ProtectedRoutes from "./utils/ProtectedRoutes"
import PublicRoutes from "./utils/PublicRoutes"
import AddDetailsPage from "./pages/AddDetailsPage"
import ProfilePage from "./pages/ProfilePage"
import ConversationsPage from "./pages/ConversationsPage"
import Chat from "./components/Chat/Chat"
import { socket } from "./socket"
import { addMessage } from "./features/messages/messageSlice"
import Notification from "./components/Notification/Notification"
import AdminLoginPage from "./pages/AdminLoginPage"
import AdminDashboardPage from "./pages/AdminDashboardPage"
import AdminUsersPage from "./pages/AdminUsersPage"
import AdminPublicRoutes from "./utils/AdminPublicRoutes"
import AdminProtectedRoutes from "./utils/AdminProtectedRoutes"
import EditProfilePage from "./pages/EditProfilePage"
import SinglePostPage from "./pages/SinglePostPage"
import { fetchOnlineUsers } from "./features/onlineUsersSlice/onlineUsersSlice"
import NotificationsPage from "./pages/NotificationsPage"
import AdminUserDetails from "./components/AdminUserDetails/AdminUserDetails"
import AdminPostsPage from "./pages/AdminPostsPage"
import AdminPostDetails from "./components/AdminPostDetails/AdminPostDetails"
import { fetchNotifications } from "./features/notifications/notificationSlice"
import { TOKEN_KEY } from "./constants/constant"
import { clearAuth } from "./features/users/authSlice"
import DiscoverPage from "./pages/DiscoverPage"
import FriendsPage from "./pages/FriendsPage"
import { useMediaQuery } from "@mui/material"
import { changeMode, setDarkMode } from "./features/appearance/appearanceSlice"
import VideoCallPage from "./pages/VideoCallPage"
import IncomingCall from "./components/IncomingCall/IncomingCall"
import { addOffer } from "./features/offer/offerSlice"
import SavedPostsPage from "./pages/SavedPostsPage"
import ElitePlansPage from "./pages/ElitePlansPage"
import AdminElitePage from "./pages/AdminElitePage"
import AdminPaymentsPage from "./pages/AdminPaymentsPage"
import VideoCall from "./components/VideoCall/VideoCall"
import LiveStream from "./components/LiveStream/LiveStream"

function App() {
  const dispatch = useDispatch()
  const authToken = useSelector((state) => state.auth)
  const appearance = useSelector((state) => state.appearance)
  const theme = createTheme(defaultTheme(appearance))
  const themeAdmin = createTheme(adminTheme(appearance))
  const { pathname } = useLocation()
  const [show, setShow] = useState(false)
  const [content, setContent] = useState(null)
  const [type, setType] = useState("")
  const [call, setCall] = useState(false)
  const [details, setDetails] = useState({})
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)")

  useEffect(() => {
    if (prefersDarkMode) {
      const mode = localStorage.getItem("preferredMode")
      if (!mode || (mode !== "light" && mode !== "dark")) {
        if (appearance === "light") {
          localStorage.setItem("preferredMode", "dark")
          dispatch(setDarkMode())
        }
      }
    }
  }, [prefersDarkMode])

  const closeNotification = () => {
    setShow(false)
  }
  const closeCall = () => {
    setCall(false)
  }
  useEffect(() => {
    if (authToken) {
      axios
        .get("/api/user/details", { headers: { Authorization: authToken } })
        .then(({ data }) => {
          dispatch(setUser(data))
        })
        .catch((error) => {
          const { response } = error
          if (response) {
            if (response.status === 403 && response.data.blocked) {
              localStorage.removeItem(TOKEN_KEY)
              dispatch(clearAuth())
            }
          }
        })
    }
  })
  useEffect(() => {
    if (authToken) {
      socket.connect()
      socket.emit("setup", authToken)
    }
  }, [authToken])

  useEffect(() => {
    socket.on("latestMessage", (message) => {
      if (
        pathname.includes("conversations") &&
        pathname.includes(message.conversation)
      ) {
        setShow(false)
        setContent(null)
        dispatch(addMessage(message))
      } else {
        setShow(true)
        setContent(message)
        setType("conversation")
      }
    })
    socket.on("checkOnlineUsers", () => {
      dispatch(fetchOnlineUsers())
    })
    socket.on("fetchNewNotification", (notification) => {
      dispatch(fetchNotifications())
      setShow(true)
      setContent(notification)
      setType(notification.type)
    })
    socket.on("newCall", (data) => {
      console.log("incoming call")
      setDetails(data)
      setCall(true)
      socket.emit("callRecieved", data)
    })
    socket.on("newOffer", ({ from, offer }) => {
      console.log("new offer recieved")
      console.log(offer, "from app")
      dispatch(addOffer(offer))
    })

    return () => {
      socket.off("newCall")
      socket.off("fetchNewNotification")
      socket.off("latestMessage")
      socket.off("checkOnlineUsers")
      socket.off("newOffer")
    }
  }, [pathname])

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Routes>
          <Route element={<ProtectedRoutes />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/details/add" element={<AddDetailsPage />} />
            <Route path="/profile/:username" element={<ProfilePage />} />
            <Route path="/profile/details/edit" element={<EditProfilePage />} />
            <Route
              path="/profile/:username/friends"
              element={<FriendsPage />}
            />
            <Route path="/posts/saved" element={<SavedPostsPage />} />
            <Route path="/elite/plans" element={<ElitePlansPage />} />
            <Route path="/conversations" element={<ConversationsPage />}>
              <Route path=":conversationId" element={<Chat />} />
            </Route>
            <Route path="/post/:postId" element={<SinglePostPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/room/:roomId" element={<VideoCall />} />
            <Route path="/live/:roomId" element={<LiveStream />} />
            <Route path="/discover" element={<DiscoverPage />} />
          </Route>
          <Route element={<PublicRoutes />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/signup/otp" element={<OtpPage />} />
          </Route>
        </Routes>
        <Notification
          message={content}
          show={show}
          type={type}
          close={closeNotification}
        />
        <IncomingCall show={call} details={details} close={closeCall} />
        <ThemeProvider theme={themeAdmin}>
          <Routes>
            <Route element={<AdminPublicRoutes />}>
              <Route path="/admin" element={<AdminLoginPage />} />
            </Route>
            <Route element={<AdminProtectedRoutes />}>
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="/admin/users" element={<AdminUsersPage />}>
                <Route path=":userId" element={<AdminUserDetails />} />
              </Route>
              <Route path="/admin/posts" element={<AdminPostsPage />}>
                <Route
                  path="/admin/posts/:postId"
                  element={<AdminPostDetails />}
                />
              </Route>
              <Route path="/admin/elite" element={<AdminElitePage />} />
              <Route path="/admin/payments" element={<AdminPaymentsPage />} />
            </Route>
          </Routes>
        </ThemeProvider>
      </div>
    </ThemeProvider>
  )
}

export default App
