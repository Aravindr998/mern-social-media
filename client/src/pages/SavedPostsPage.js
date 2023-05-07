import { Container, CssBaseline } from "@mui/material"
import React from "react"
import Navbar from "../components/Navbar/Navbar"
import SidePanel from "../components/SidePanel/SidePanel"
import ActivePanel from "../components/ActivePanel/ActivePanel"
import SavedPosts from "../components/SavedPosts/SavedPosts"

const SavedPostsPage = () => {
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
        <SavedPosts />
      </Container>
    </>
  )
}

export default SavedPostsPage
