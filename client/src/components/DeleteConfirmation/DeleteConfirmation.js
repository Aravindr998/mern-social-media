import React, { useEffect, useState } from "react"
import Button from "@mui/material/Button"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import axios from "../../axios"
import { useSelector } from "react-redux"

const DeleteConfirmation = ({
  postId,
  show,
  handleCloseConfirmation,
  removePost,
}) => {
  const [open, setOpen] = useState(false)
  const adminAuth = useSelector((state) => state.adminAuth)

  useEffect(() => {
    if (show) setOpen(true)
  }, [show])

  const handleClose = () => {
    setOpen(false)
    handleCloseConfirmation()
  }
  const handleDeletePost = async () => {
    try {
      const { data } = await axios.patch(
        "/api/admin/post/delete",
        { postId },
        { headers: { Authorization: adminAuth } }
      )
      removePost(data)
      setOpen(false)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"Are you sure?"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete this post? Deleted posts cannot be
          recovered.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleDeletePost} autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteConfirmation
