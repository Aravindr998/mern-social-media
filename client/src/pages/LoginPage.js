import { Box, Card, CardContent } from "@mui/material"
import { Container } from "@mui/system"
import React from "react"
import LoginForm from "../components/LoginForm/LoginForm"
import TypographyBody from "../components/ui/TypographyBody"
import TypographyTitle from "../components/ui/TypographyTitle"

function LoginPage() {
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
