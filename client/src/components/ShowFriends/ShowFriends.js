import React, { useEffect, useState } from "react"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import { Avatar, Box, Divider, Stack, Typography } from "@mui/material"
import { useNavigate } from "react-router-dom"

const ShowFriends = ({ show, handleCloseLikes, likes }) => {
  const [open, setOpen] = useState(false)
  const [likedUsers, setLikedUsers] = useState([])
  const navigate = useNavigate()
  useEffect(() => {
    if (likes) setLikedUsers(likes)
  }, [likes])
  useEffect(() => {
    if (show) {
      setOpen(true)
    }
  }, [show])

  const handleClose = () => {
    setOpen(false)
    handleCloseLikes()
  }
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Likes"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {likedUsers.length ? (
            <Stack spacing={1}>
              {likedUsers.map((user) => {
                return (
                  <>
                    <Box
                      display={"flex"}
                      alignItems={"center"}
                      sx={{
                        "&:hover": {
                          backgroundColor: "#DFDFDF",
                        },
                        padding: "0.4rem",
                        borderRadius: "0.5rem",
                        cursor: "pointer",
                        minWidth: "20rem",
                      }}
                      onClick={() => {
                        navigate(`/admin/users/${user._id}`)
                      }}
                    >
                      <Avatar
                        sx={{ marginRight: "0.5rem" }}
                        src={user.profilePicture}
                      />
                      <Typography>{user.username}</Typography>
                    </Box>
                    <Divider />
                  </>
                )
              })}
            </Stack>
          ) : (
            <Box sx={{ minWidth: "20rem" }}>
              <Typography>No likes to show</Typography>
            </Box>
          )}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} autoFocus>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ShowFriends
