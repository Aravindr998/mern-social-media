import "./App.css"
import LoginPage from "./pages/LoginPage"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import { defaultTheme } from "./theme/theme"
import { Routes, Route } from "react-router-dom"
import SignupPage from "./pages/SignupPage"
import OtpPage from "./pages/OtpPage"
import { useEffect } from "react"
import axios from "./axios"
import { useDispatch, useSelector } from "react-redux"
import { setUser } from "./features/users/userSlice"
import HomePage from "./pages/HomePage"
import ProtectedRoutes from "./utils/ProtectedRoutes"
import PublicRoutes from "./utils/PublicRoutes"
import AddDetailsPage from "./pages/AddDetailsPage"
import ProfilePage from "./pages/ProfilePage"

const mode = "light"
const theme = createTheme(defaultTheme(mode))

function App() {
  const dispatch = useDispatch()
  const authToken = useSelector((state) => state.auth)
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

  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Routes>
          <Route element={<ProtectedRoutes />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/details/add" element={<AddDetailsPage />} />
            <Route path="/profile/:username" element={<ProfilePage />} />
          </Route>
          <Route element={<PublicRoutes />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/signup/otp" element={<OtpPage />} />
          </Route>
        </Routes>
      </div>
    </ThemeProvider>
  )
}

export default App
