import { Card, CardContent } from "@mui/material"
import { Container } from "@mui/system"
import React, { useEffect } from "react"
import AdminLogin from "../components/AdminLogin/AdminLogin"

function AdminLoginPage() {
  useEffect(() => {
    document.title = "Admin | Login"
  }, [])
  return (
    <>
      <Container
        sx={{
          display: "flex",
          alignItems: "center",
          height: "100vh",
          justifyContent: "center",
        }}
      >
        <Card
          sx={{
            padding: "0.5rem",
            display: "inline-block",
            borderRadius: "25px",
          }}
        >
          <CardContent>
            <AdminLogin />
          </CardContent>
        </Card>
      </Container>
    </>
  )
}

export default AdminLoginPage
