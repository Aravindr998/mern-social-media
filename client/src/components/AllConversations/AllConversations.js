import React, { useEffect, useState } from "react"
import {
  Avatar,
  Box,
  Button,
  Paper,
  TextField,
  Typography,
} from "@mui/material"
import Conversation from "../Conversation/Conversation"
import { useDispatch, useSelector } from "react-redux"
import {
  addConversation,
  fetchCoversations,
} from "../../features/conversations/conversationSlice"
import Chat from "../Chat/Chat"
import { Outlet, useParams } from "react-router-dom"
import SelectChat from "../SelectChat/SelectChat"
import axios from "../../axios"
import { socket } from "../../socket"

const AllConversations = () => {
  const dispatch = useDispatch()
  const { conversationId } = useParams()
  const conversations = useSelector((state) => state.conversations)
  const auth = useSelector((state) => state.auth)
  const [search, setSearch] = useState("")
  const [result, setResult] = useState([])
  useEffect(() => {
    dispatch(fetchCoversations())
    socket.on("fetchConversation", () => {
      dispatch(fetchCoversations())
    })
    return () => {
      socket.off("fetchConversation")
    }
  }, [])
  const handleSearch = (e) => {
    setSearch(e.target.value)
    axios
      .get(`/api/conversation/search/users?key=${search}`, {
        headers: { Authorization: auth },
      })
      .then(({ data }) => setResult(data))
      .catch((error) => console.log(error))
  }
  const startConversation = (userId) => {
    axios
      .post(
        "/api/conversation/create",
        { members: [userId] },
        { headers: { Authorization: auth } }
      )
      .then(({ data }) => {
        console.log(data)
        setSearch("")
        dispatch(addConversation(data))
        socket.emit("newConversation", userId)
      })
  }
  const searchResult = result.map((item) => {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          padding: "1rem",
          "&:hover": {
            backgroundColor: "#DFDFDF",
          },
          cursor: "pointer",
        }}
        onClick={() => startConversation(item._id)}
        key={item._id}
      >
        <Avatar sx={{ marginRight: "0.5rem" }} />
        <Typography>{item.username}</Typography>
      </Box>
    )
  })
  let conversationsList
  if (conversations.error) {
    conversationsList = "Something went wrong. Please try again later."
  } else if (conversations.conversations.length) {
    conversationsList = conversations.conversations.map((item) => {
      return <Conversation key={item._id} details={item} />
    })
  } else {
    conversationsList = (
      <Typography textAlign={"center"} fontWeight={500}>
        No chats to show
      </Typography>
    )
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
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "1rem",
            position: "relative",
          }}
        >
          <TextField
            placeholder="New Conversation"
            sx={{ width: "90%" }}
            variant="standard"
            value={search}
            onChange={handleSearch}
          />
          {search && (
            <Box
              sx={{
                position: "absolute",
                backgroundColor: "white",
                top: 32,
                left: 0,
                right: 0,
                zIndex: 2,
              }}
            >
              {searchResult}
            </Box>
          )}
        </Box>
        {conversationsList}
      </Box>
    </Paper>
  )
}

export default AllConversations
