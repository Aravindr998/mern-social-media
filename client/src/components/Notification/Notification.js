import React, { useEffect, useState } from "react"
import { Alert, Box, Snackbar } from "@mui/material"
import { useNavigate } from "react-router-dom"

const Notification = ({ message, show, type, close }) => {
  const [open, setOpen] = useState(false)
  const [content, setContent] = useState("")
  const navigate = useNavigate()
  useEffect(() => {
    if (show) {
      setOpen(true)
    }
  }, [show])
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return
    }

    setOpen(false)
    close()
  }
  const handleClick = () => {
    if (type === "create") {
      navigate(`/post/${message.postId}`)
    } else if (type === "post") {
      if (message.postId.shared) navigate(`/post/${message.postId.postId}`)
      else navigate(`/post/${message.postId._id}`)
    }
  }
  useEffect(() => {
    console.log("here on notification")
    if (type === "conversation") {
      setContent(`${message?.sender?.username} sent you a message`)
    } else if (type === "create") {
      setContent(`${message?.userId?.username} created a new post`)
    } else if (type === "post") {
      setContent(
        `${message?.userId?.username} ${message?.interaction} your post`
      )
    }
  }, [message])
  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <Alert
        onClose={handleClose}
        severity="info"
        variant="filled"
        sx={{ width: "100%", cursor: "pointer" }}
      >
        <Box onClick={handleClick}>{content}</Box>
      </Alert>
    </Snackbar>
  )
}

export default Notification
