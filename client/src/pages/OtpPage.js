import { Card, CardContent } from "@mui/material"
import { Container } from "@mui/system"
import React from "react"
import OtpForm from "../components/OtpForm/OtpForm"

function OtpPage() {
  return (
    <>
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
            <OtpForm />
          </CardContent>
        </Card>
      </Container>
    </>
  )
}

export default OtpPage
