import { Box, Typography } from "@mui/material"
import ChatIcon from "@mui/icons-material/Chat"
import React from "react"

const SelectChat = () => {
  return (
    <Box
      sx={{
        width: "70%",
        height: "90%",
        display: { xs: "none", sm: "flex" },
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ChatIcon fontSize="large" />
      <Typography fontSize={20} fontWeight={500} textAlign={"center"}>
        Select a conversation to start chatting
      </Typography>
    </Box>
  )
}

export default SelectChat
