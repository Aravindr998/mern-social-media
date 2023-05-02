import { CssBaseline } from "@mui/material"
import { Container } from "@mui/system"
import React, { useEffect } from "react"
import ActivePanel from "../components/ActivePanel/ActivePanel"
import Navbar from "../components/Navbar/Navbar"
import Profile from "../components/Profile/Profile"
import SidePanel from "../components/SidePanel/SidePanel"

function ProfilePage() {
  useEffect(() => {
    document.title = "Vibee | Profile"
  }, [])
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
        <Profile />
      </Container>
    </>
  )
}

export default ProfilePage
