import React from "react"
import EnterEmailOTP from "../components/EnterEmailOTP/EnterEmailOTP"
import { Card, CardContent, Container, CssBaseline } from "@mui/material"

const EmailOtpPage = () => {
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
            <EnterEmailOTP />
          </CardContent>
        </Card>
      </Container>
    </>
  )
}

export default EmailOtpPage
