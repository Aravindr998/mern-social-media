import "./App.css"
import LoginPage from "./pages/LoginPage"
import { createTheme, ThemeProvider } from "@mui/material/styles"
import { defaultTheme } from "./theme/theme"
import { Routes, Route } from "react-router-dom"
import SignupPage from "./pages/SignupPage"

const mode = "light"
const theme = createTheme(defaultTheme(mode))

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Routes>
      </div>
    </ThemeProvider>
  )
}

export default App
