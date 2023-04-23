import React, { useEffect } from "react"
import { Box, Paper } from "@mui/material"
import Conversation from "../Conversation/Conversation"
import { useDispatch, useSelector } from "react-redux"
import { fetchCoversations } from "../../features/conversations/conversationSlice"
import Chat from "../Chat/Chat"
import { Outlet, useParams } from "react-router-dom"
import SelectChat from "../SelectChat/SelectChat"

const AllConversations = () => {
  const dispatch = useDispatch()
  const { conversationId } = useParams()
  const conversations = useSelector((state) => state.conversations)
  useEffect(() => {
    dispatch(fetchCoversations())
  }, [])
  let conversationsList
  if (conversations.error) {
    conversationsList = "Something went wrong. Please try again later."
  } else if (conversations.conversations.length) {
    conversationsList = conversations.conversations.map((item) => {
      return <Conversation key={item._id} details={item} />
    })
  } else {
    conversationsList = "No chats to show"
  }
  console.log(conversations)
  return (
    <Paper
      sx={{
        width: "100%",
        height: "82vh",
        display: "flex",
        alignItems: "center",
        padding: "0.5rem",
        justifyContent: "flex-end",
      }}
    >
      {conversationId ? <Outlet /> : <SelectChat />}
      <Box
        sx={{
          width: { xs: "100%", sm: "30%" },
          height: "90%",
          borderLeft: "solid 1px #DFDFDF",
        }}
      >
        {conversationsList}
      </Box>
    </Paper>
  )
}

export default AllConversations
