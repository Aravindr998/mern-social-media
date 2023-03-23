import { CssBaseline } from "@mui/material"
import { Container } from "@mui/system"
import React from "react"
import ActivePanel from "../components/ActivePanel/ActivePanel"
import Create from "../components/Create/Create"
import Navbar from "../components/Navbar/Navbar"
import PostFeed from "../components/PostFeed/PostFeed"
import SidePanel from "../components/SidePanel/SidePanel"

function HomePage() {
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
          marginTop: 12.5,
          // paddingLeft: { xs: "2rem ", lg: "18rem !important" },
          // paddingRight: { xs: "2rem ", lg: "18rem !important" },
        }}
      >
        <Create />
        <PostFeed />
        <PostFeed />
        <PostFeed />
        <PostFeed />
      </Container>
    </>
  )
}

export default HomePage
