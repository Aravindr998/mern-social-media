import React, { useEffect, useState } from "react"
import { Alert, Snackbar } from "@mui/material"

const Notification = ({ message, show, type, close }) => {
  const [open, setOpen] = useState(false)
  const [content, setContent] = useState("")
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
  useEffect(() => {
    if (type === "conversation") {
      setContent(`${message?.sender?.username} sent you a message`)
    }
  }, [message])
  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <Alert
        onClose={handleClose}
        severity="info"
        variant="filled"
        sx={{ width: "100%" }}
      >
        {content}
      </Alert>
    </Snackbar>
  )
}

export default Notification
