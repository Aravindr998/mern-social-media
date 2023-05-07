import React, { useEffect } from "react"
import Notifications from "../components/Notifications/Notifications"
import { Container, CssBaseline } from "@mui/material"
import Navbar from "../components/Navbar/Navbar"
import SidePanel from "../components/SidePanel/SidePanel"
import ActivePanel from "../components/ActivePanel/ActivePanel"

const NotificationsPage = () => {
  useEffect(() => {
    document.title = "Vibee | Notifications"
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
        }}
      >
        <Notifications />
      </Container>
    </>
  )
}

export default NotificationsPage
