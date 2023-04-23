import React, { useEffect, useState } from "react"
import { Alert, Snackbar } from "@mui/material"

const SidePopup = ({ message, type, show }) => {
  const [open, setOpen] = useState(false)
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
  }

  return (
    <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity={type} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  )
}

export default SidePopup
