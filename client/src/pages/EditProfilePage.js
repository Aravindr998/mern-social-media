import { Container, CssBaseline } from "@mui/material"
import React, { useEffect } from "react"
import Navbar from "../components/Navbar/Navbar"
import SidePanel from "../components/SidePanel/SidePanel"
import EditProfile from "../components/EditProfile/EditProfile"

const EditProfilePage = () => {
  useEffect(() => {
    document.title = "Vibee | Edit Profile"
  }, [])
  return (
    <>
      <CssBaseline />
      <Navbar />
      <SidePanel />
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-end",
          width: { sm: "100%", lg: "77%" },
          marginTop: 12.5,
          marginRight: 0,
          paddingLeft: "40px !important",
        }}
      >
        <EditProfile />
      </Container>
    </>
  )
}

export default EditProfilePage
