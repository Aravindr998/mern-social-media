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

const mode = "light"
const theme = createTheme(defaultTheme(mode))
const themeAdmin = createTheme(adminTheme(mode))

function App() {
  const dispatch = useDispatch()
  const authToken = useSelector((state) => state.auth)
  const { pathname } = useLocation()
  const [show, setShow] = useState(false)
  const [content, setContent] = useState(null)
  const [type, setType] = useState("")
  console.log(pathname)
  const closeNotification = () => {
    setShow(false)
  }
  useEffect(() => {
    if (authToken) {
      axios
        .get("/api/user/details", { headers: { Authorization: authToken } })
        .then(({ data }) => {
          dispatch(setUser(data))
        })
        .catch((error) => console.log(error))
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
        console.log("not in conversation")
        setShow(true)
        setContent(message)
        setType("conversation")
      }
    })

    return () => {
      socket.off("latestMessage")
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
            <Route path="/conversations" element={<ConversationsPage />}>
              <Route path=":conversationId" element={<Chat />} />
            </Route>
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
        <ThemeProvider theme={themeAdmin}>
          <Routes>
            <Route element={<AdminPublicRoutes />}>
              <Route path="/admin" element={<AdminLoginPage />} />
            </Route>
            <Route element={<AdminProtectedRoutes />}>
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
            </Route>
          </Routes>
        </ThemeProvider>
      </div>
    </ThemeProvider>
  )
}

export default App
