import { Box, Container, CssBaseline, Typography } from "@mui/material"
import React from "react"
import Navbar from "../components/Navbar/Navbar"
import SidePanel from "../components/SidePanel/SidePanel"
import ActivePanel from "../components/ActivePanel/ActivePanel"

const ContentNotAvailable = () => {
  return (
    <>
      <CssBaseline />
      <Navbar />
      <SidePanel />
      <ActivePanel />
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
        <Box component={"img"} width={"15rem"} src="/images/link.png"></Box>
        <Typography fontSize={"2rem"} fontWeight={500}>
          The content you requested is not availabe
        </Typography>
      </Container>
    </>
  )
}

export default ContentNotAvailable
