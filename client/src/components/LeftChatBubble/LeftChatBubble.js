import { useTheme } from "@emotion/react"
import { Box, Typography } from "@mui/material"
import React from "react"
import { useNavigate } from "react-router-dom"
import { baseURL } from "../../constants/constant"

const LeftChatBubble = ({ message, link }) => {
  const theme = useTheme()
  const navigate = useNavigate()
  const backgroundColor = theme.palette.mode === "dark" ? "#4e4f4f" : "#DFDFDF"
  return (
    <Box
      sx={{
        margin: "0.5rem 0rem 1rem 0rem",
      }}
    >
      {!link ? (
        <Box
          sx={{
            backgroundColor,
            display: "inline-block",
            borderRadius: "0.5rem",
            padding: "0.5rem 1rem 0.5rem 1rem",
          }}
        >
          <Typography
            sx={{
              backgroundColor: backgroundColor,
              display: "inline",
              borderRadius: "0.5rem",
            }}
          >
            {message}
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            backgroundColor,
            display: "inline-block",
            borderRadius: "0.5rem",
            padding: "0.5rem 1rem 0.5rem 1rem",
          }}
        >
          <Typography
            sx={{
              backgroundColor,
              display: "inline",
              textDecoration: "underline",
              cursor: "pointer",
            }}
            onClick={() => {
              navigate(message)
            }}
          >
            {`${baseURL}${message}`}
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default LeftChatBubble
