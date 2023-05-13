import { Card, CardContent, Container, CssBaseline } from "@mui/material"
import React, { useEffect } from "react"
import ConfirmPassword from "../components/ConfirmPassword/ConfirmPassword"
import { useNavigate } from "react-router-dom"

const ConfirmPasswordPage = () => {
  const navigate = useNavigate()
  useEffect(() => {
    const token = localStorage.getItem("tempToken")
    if (!token) navigate("/login")
  }, [])
  return (
    <>
      <CssBaseline />
      <Container
        sx={{
          display: "flex",
          alignItems: "center",
          minHeight: "100vh",
          justifyContent: "center",
        }}
      >
        <Card
          sx={{
            padding: "0.5rem",
            display: "inline-block",
            borderRadius: "25px",
            mt: 2,
            mb: 2,
            minWidth: "35rem",
          }}
        >
          <CardContent>
            <ConfirmPassword />
          </CardContent>
        </Card>
      </Container>
    </>
  )
}

export default ConfirmPasswordPage
