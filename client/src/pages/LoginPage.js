import { Box, Card, CardContent } from "@mui/material"
import { Container } from "@mui/system"
import React, { useEffect } from "react"
import LoginForm from "../components/LoginForm/LoginForm"
import TypographyBody from "../components/ui/TypographyBody"
import TypographyTitle from "../components/ui/TypographyTitle"
import { TOKEN_KEY } from "../constants/constant"
import { useNavigate, useSearchParams } from "react-router-dom"
import { setAuth } from "../features/users/authSlice"
import { useDispatch } from "react-redux"

function LoginPage() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [searchParams] = useSearchParams()
  const googleToken = searchParams.get("googleToken")
  useEffect(() => {
    document.title = "Vibee | Login"
    const token = document.cookie
      ?.split("; ")
      ?.find((row) => row.startsWith("googleToken"))
      ?.split("=")[1]
    console.log(token)
    console.log(document.cookie)
    if (token) {
      console.log("recieved token")
      localStorage.setItem(TOKEN_KEY, `Bearer ${token}`)
      document.cookie =
        "googleToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
      dispatch(setAuth())
      navigate("/")
    }
  }, [])
  useEffect(() => {
    if (googleToken) {
      localStorage.setItem(TOKEN_KEY, `Bearer ${googleToken}`)
      dispatch(setAuth())
      navigate("/")
    }
  }, [googleToken])
  return (
    <>
      <Container
        sx={{
          display: "flex",
          alignItems: "center",
          height: "100vh",
          justifyContent: { xs: "center", lg: "space-between" },
        }}
      >
        <Box sx={{ display: { xs: "none", lg: "block" } }}>
          <TypographyTitle>vibee</TypographyTitle>
          <TypographyBody>
            The place where you can connect, reflect and perfect
          </TypographyBody>
        </Box>
        <Card
          sx={{
            padding: "0.5rem",
            display: "inline-block",
            borderRadius: "25px",
          }}
        >
          <CardContent>
            <LoginForm />
          </CardContent>
        </Card>
      </Container>
    </>
  )
}

export default LoginPage
