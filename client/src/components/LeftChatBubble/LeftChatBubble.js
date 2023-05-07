import { useTheme } from "@emotion/react"
import { Box, Typography } from "@mui/material"
import React from "react"

const LeftChatBubble = ({ message }) => {
  const theme = useTheme()
  const backgroundColor = theme.palette.mode === "dark" ? "#4e4f4f" : "#DFDFDF"
  return (
    <Box
      sx={{
        margin: "0.5rem 0rem 1rem 0rem",
      }}
    >
      <Typography
        sx={{
          backgroundColor: backgroundColor,
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
