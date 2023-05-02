import { Box, Card, CardContent } from "@mui/material"
import { Container } from "@mui/system"
import React, { useEffect } from "react"
import SignupForm from "../components/SignupForm/SignupForm"
import TypographyBody from "../components/ui/TypographyBody"
import TypographyTitle from "../components/ui/TypographyTitle"

function SignupPage() {
  useEffect(() => {
    document.title = "Vibee | SignUp"
  }, [])
  return (
    <>
      <Container
        sx={{
          display: "flex",
          alignItems: "center",
          minHeight: "100vh",
          justifyContent: { xs: "center", lg: "space-between" },
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
            <SignupForm />
          </CardContent>
        </Card>
        <Box sx={{ display: { xs: "none", lg: "block" } }}>
          <TypographyTitle className="align-right">vibee</TypographyTitle>
          <TypographyBody className="align-right">
            Connecting you with like minds
          </TypographyBody>
        </Box>
      </Container>
    </>
  )
}

export default SignupPage
