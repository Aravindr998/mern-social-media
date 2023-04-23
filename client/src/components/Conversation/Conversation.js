import React from "react"
import { Avatar, Box, Typography } from "@mui/material"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { socket } from "../../socket"

const Conversation = ({ details }) => {
  const user = useSelector((state) => state.user)
  const navigate = useNavigate()
  const clickHandler = () => {
    navigate(`/conversations/${details?._id}`)
    socket.emit("joinChat", details)
  }
  let senderName =
    details?.users[0]?._id !== user?._id
      ? details?.users[0]?.username
      : details?.users[1]?.username
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        padding: "0.5rem",
        borderBottom: "solid 1px #DFDFDF",
        "&:hover": {
          backgroundColor: "#DFDFDF",
        },
        cursor: "pointer",
        transition: "background-color 0.3s",
      }}
      onClick={clickHandler}
    >
      <Avatar />
      <Box sx={{ marginLeft: 2 }}>
        <Typography fontWeight={500}>
          {details?.isGroupChat ? details?.chatName : senderName}
        </Typography>
        {details?.sender && (
          <Typography fontSize={12}>
            {details?.sender?._id === user?._id
              ? "You: "
              : details?.sender?.username + ": "}
            {details?.message}
          </Typography>
        )}
      </Box>
    </Box>
  )
}

export default Conversation
