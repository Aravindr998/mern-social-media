import React, { useEffect, useRef, useState } from "react"
import {
  Avatar,
  Box,
  Button,
  IconButton,
  TextField,
  Typography,
} from "@mui/material"
import LeftChatBubble from "../LeftChatBubble/LeftChatBubble"
import RightChatBubble from "../RightChatBubble/RightChatBubble"
import VideoCallIcon from "@mui/icons-material/VideoCall"
import CallIcon from "@mui/icons-material/Call"
import SendIcon from "@mui/icons-material/Send"
import { useNavigate, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { addMessage, fetchMessages } from "../../features/messages/messageSlice"
import axios from "../../axios"
import SidePopup from "../SidePopup/SidePopup"
import { socket } from "../../socket"
import GroupChatDetail from "../GroupChatDetails/GroupChatDetail"
import { fetchOnlineUsers } from "../../features/onlineUsersSlice/onlineUsersSlice"

const Chat = () => {
  const [content, setContent] = useState("")
  const [showError, setShowError] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [isOnline, setIsOnline] = useState(false)
  const messages = useSelector((state) => state.messages)
  const user = useSelector((state) => state.user)
  const auth = useSelector((state) => state.auth)
  const onlineUsers = useSelector((state) => state.onlineUsers)
  const chatParent = useRef()
  const { conversationId } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  useEffect(() => {
    dispatch(fetchOnlineUsers())
  }, [])
  useEffect(() => {
    setContent("")
  }, [conversationId])
  useEffect(() => {
    const domNode = chatParent.current
    if (domNode) {
      domNode.scrollTop = domNode.scrollHeight
    }
  })
  const handleSend = () => {
    setShowError(false)
    axios
      .post(
        `/api/conversation/message/${conversationId}`,
        { content },
        {
          headers: { Authorization: auth },
        }
      )
      .then(({ data }) => {
        dispatch(addMessage(data))
        setContent("")
        socket.emit("newMessage", data)
      })
      .catch((error) => {
        console.log(error)
        setContent("")
        setShowError(true)
      })
  }
  useEffect(() => {
    dispatch(fetchMessages(conversationId))
  }, [conversationId])

  let senderName
  let chatBubbles
  let noChats
  let profilePicture
  console.log(messages)
  if (messages?.messages.users) {
    senderName =
      messages?.messages?.users[0]?._id !== user?._id
        ? messages?.messages?.users[0]?.username
        : messages?.messages?.users[1]?.username
    profilePicture = messages.messages?.isGroupChat
      ? messages.messages?.groupChatImage
      : messages?.messages?.users[0]?._id !== user?._id
      ? messages?.messages?.users[0]?.profilePicture
      : messages?.messages?.users[1]?.profilePicture
    if (messages?.messages?.messages.length) {
      chatBubbles = messages?.messages?.messages?.map((item, index, array) => {
        if (item.sender._id === user?._id) {
          return <RightChatBubble message={item.content} key={item._id} />
        } else {
          return (
            <React.Fragment key={item._id}>
              {item.sender._id !== array[index - 1]?.sender?._id && (
                <Typography
                  fontSize={"0.75rem"}
                  fontWeight={500}
                  color={"gray"}
                >
                  {item.sender.username}
                </Typography>
              )}
              <LeftChatBubble message={item.content} key={item._id} />
            </React.Fragment>
          )
        }
      })
    } else {
      noChats = "No messages to show"
    }
  }
  useEffect(() => {
    if (messages?.messages.users) {
      const currentUser =
        messages?.messages?.users[0]?._id !== user?._id
          ? messages?.messages?.users[0]?._id
          : messages?.messages?.users[1]?._id
      const isActive = onlineUsers?.users?.find(
        (user) => user.userId._id === currentUser
      )
      if (isActive) setIsOnline(true)
      else setIsOnline(false)
    }
  }, [onlineUsers, messages])

  const profileHandler = () => {
    if (messages?.messages?.isGroupChat === false) {
      navigate(`/profile/${senderName}`)
    } else if (messages?.messages?.isGroupChat === true) {
      setShowDetails(true)
    }
  }
  const handleClose = () => {
    setShowDetails(false)
  }
  return (
    <>
      <Box
        sx={{
          width: "70%",
          height: "90%",
          display: { xs: "none", sm: "flex" },
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            width: "100%",
            height: "10%",
            paddingLeft: "10px",
            display: "flex",
            justifyContent: "space-between",
            borderBottom: "solid 1px #DFDFDF",
          }}
        >
          <Box
            sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            onClick={profileHandler}
          >
            <Avatar src={profilePicture} />
            <Box sx={{ paddingLeft: "10px" }}>
              <Typography sx={{ fontWeight: "500" }}>
                {messages?.messages?.isGroupChat
                  ? messages?.messages?.chatName
                  : senderName}
              </Typography>
              {isOnline && !messages?.messages?.isGroupChat && (
                <Typography sx={{ fontSize: ".75rem" }}>online</Typography>
              )}
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "12%",
              marginRight: 2,
            }}
          >
            <IconButton>
              <VideoCallIcon color="primary" />
            </IconButton>
            <IconButton>
              <CallIcon fontSize="small" color="primary" />
            </IconButton>
          </Box>
        </Box>
        <Box
          sx={{
            width: "100%",
            height: "90%",
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
            // justifyContent: "flex-end",
            overflowY: "auto",
          }}
          ref={chatParent}
        >
          {chatBubbles}
          {noChats && (
            <Typography textAlign={"center"} fontSize={13} fontWeight={500}>
              {noChats}
            </Typography>
          )}
        </Box>
        <Box sx={{ width: "100%", display: "flex", paddingTop: "1rem" }}>
          <TextField
            fullWidth
            sx={{ marginRight: "1rem" }}
            variant="outlined"
            placeholder="Write Something..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Button variant="contained" onClick={handleSend}>
            <SendIcon />
          </Button>
        </Box>
        <SidePopup
          message={"Couldn't send message. Please try again later"}
          type={"error"}
          show={showError}
        />
      </Box>
      <GroupChatDetail show={showDetails} close={handleClose} />
    </>
  )
}

export default Chat
