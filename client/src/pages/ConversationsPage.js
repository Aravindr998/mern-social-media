import { Container, CssBaseline } from "@mui/material"
import React, { useEffect } from "react"
import SidePanel from "../components/SidePanel/SidePanel"
import Navbar from "../components/Navbar/Navbar"
import AllConversations from "../components/AllConversations/AllConversations"

const ConversationsPage = () => {
  useEffect(() => {
    document.title = "Vibee | Conversations"
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
          marginTop: 10.5,
          marginRight: 0,
          paddingLeft: "40px !important",
        }}
      >
        <AllConversations />
      </Container>
    </>
  )
}

export default ConversationsPage
