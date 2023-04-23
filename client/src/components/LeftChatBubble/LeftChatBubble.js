import { Box, Typography } from "@mui/material"
import React from "react"

const LeftChatBubble = ({ message }) => {
  return (
    <Box
      sx={{
        margin: "0.5rem 0rem 1rem 0rem",
      }}
    >
      <Typography
        sx={{
          backgroundColor: "#EFEFEF",
          display: "inline",
          padding: "0.5rem 1rem 0.5rem 1rem",
          borderRadius: "0.5rem",
        }}
      >
        {message}
      </Typography>
    </Box>
  )
}

export default LeftChatBubble
