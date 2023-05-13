import { Card, CardContent, Container, CssBaseline } from "@mui/material"
import React from "react"
import EnterEmail from "../components/EnterEmail/EnterEmail"

const EnterEmailPage = () => {
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
            <EnterEmail />
          </CardContent>
        </Card>
      </Container>
    </>
  )
}

export default EnterEmailPage
