import { Container, CssBaseline } from "@mui/material"
import React from "react"
import Navbar from "../components/Navbar/Navbar"
import SidePanel from "../components/SidePanel/SidePanel"
import ActivePanel from "../components/ActivePanel/ActivePanel"
import Friends from "../components/Friends/Friends"

const FriendsPage = () => {
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
          // paddingLeft: { xs: "2rem ", lg: "18rem !important" },
          // paddingRight: { xs: "2rem ", lg: "18rem !important" },
        }}
      >
        <Friends />
      </Container>
    </>
  )
}

export default FriendsPage
