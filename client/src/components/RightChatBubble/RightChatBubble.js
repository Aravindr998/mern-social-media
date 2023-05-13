import React, { useEffect, useState } from "react"
import { Box, Typography } from "@mui/material"
import { useTheme } from "@emotion/react"
import { Link, useNavigate } from "react-router-dom"
import { baseURL } from "../../constants/constant"

const RightChatBubble = ({ message, link }) => {
  const theme = useTheme()
  const navigate = useNavigate()

  return (
    <Box
      sx={{
        margin: "0rem 0rem 0.5rem 0rem",
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      {!link ? (
        <Box
          sx={{
            backgroundColor: theme.palette.primary.main,
            display: "inline-block",
            borderRadius: "0.5rem",
            padding: "0.5rem 1rem 0.5rem 1rem",
          }}
        >
          <Typography
            sx={{
              backgroundColor: theme.palette.primary.main,
              display: "inline",
              color: "white",
            }}
          >
            {message}
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            backgroundColor: theme.palette.primary.main,
            display: "inline-block",
            borderRadius: "0.5rem",
            padding: "0.5rem 1rem 0.5rem 1rem",
          }}
        >
          <Typography
            sx={{
              backgroundColor: theme.palette.primary.main,
              display: "inline",
              color: "white",
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

export default RightChatBubble
