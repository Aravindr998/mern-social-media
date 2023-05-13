import { Box, Button, Container, CssBaseline, Typography } from "@mui/material"
import React from "react"
import { useNavigate } from "react-router-dom"

const PageNotFound = () => {
  const navigate = useNavigate()
  return (
    <>
      <CssBaseline />
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 10,
          height: "82vh",
        }}
      >
        <Box component={"img"} src="/images/search.png"></Box>
        <Typography fontSize={"2rem"} fontWeight={500}>
          The page you requested is not found
        </Typography>
        <Button color="info" size="large" onClick={() => navigate(-1)}>
          Go Back
        </Button>
      </Container>
    </>
  )
}

export default PageNotFound
