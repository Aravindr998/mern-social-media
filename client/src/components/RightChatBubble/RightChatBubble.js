import React from "react"
import { Box, Typography } from "@mui/material"
import { useTheme } from "@emotion/react"

const RightChatBubble = ({ message }) => {
  const theme = useTheme()
  return (
    <Box
      sx={{
        margin: "0rem 0rem 0.5rem 0rem",
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <Typography
        sx={{
          backgroundColor: theme.palette.primary.main,
          display: "inline",
          padding: "0.5rem 1rem 0.5rem 1rem",
          borderRadius: "0.5rem",
          color: "white",
        }}
      >
        {message}
      </Typography>
    </Box>
  )
}

export default RightChatBubble
