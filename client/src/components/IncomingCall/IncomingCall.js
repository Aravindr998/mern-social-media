import React, { forwardRef, useEffect, useState } from "react"
import Dialog from "@mui/material/Dialog"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import Slide from "@mui/material/Slide"
import { Avatar, Box, Fab, Tooltip, Typography } from "@mui/material"
import CallIcon from "@mui/icons-material/Call"
import CallEndIcon from "@mui/icons-material/CallEnd"
import { socket } from "../../socket"
import { useNavigate } from "react-router-dom"

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const IncomingCall = ({ show, details, close }) => {
  const [open, setOpen] = useState(false)
  const [profilePicture, setProfilePicture] = useState("")
  const [username, setUsername] = useState("")
  const navigate = useNavigate()
  console.log(details)

  useEffect(() => {
    if (show) {
      setOpen(true)
    } else {
      setOpen(false)
    }
  }, [show])
  useEffect(() => {
    if (details) {
      setProfilePicture(details?.to?.profilePicture)
      setUsername(details?.to?.username)
    }
  }, [details])

  console.log(profilePicture)
  console.log(username)

  const handleClose = (_, reason) => {
    if (reason === "backdropClick") return
    setOpen(false)
    close()
  }

  const acceptCallHandler = () => {
    handleClose()
    window.open(`/room/${details._id}`, "_blank", "height=400,width=600")
    socket.emit("callAccepted", details)
  }

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle textAlign={"center"}>{"Incoming Call"}</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            minWidth: "20rem",
          }}
        >
          <Avatar
            sx={{ margin: "1.2rem", width: 70, height: 70 }}
            src={profilePicture}
          />
          <Typography fontSize={"1.5rem"} fontWeight={500} mb={5}>
            {username}
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            marginBottom: "1rem",
          }}
        >
          <Tooltip title="Accept Call">
            <Fab color="success" onClick={acceptCallHandler}>
              <CallIcon />
            </Fab>
          </Tooltip>
          <Tooltip title="Reject Call">
            <Fab color="error">
              <CallEndIcon />
            </Fab>
          </Tooltip>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default IncomingCall
