import React, { useEffect, useState, forwardRef } from "react"
import Paper from "@mui/material/Paper"
import MenuList from "@mui/material/MenuList"
import MenuItem from "@mui/material/MenuItem"
import ListItemText from "@mui/material/ListItemText"
import ListItemIcon from "@mui/material/ListItemIcon"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import ReportIcon from "@mui/icons-material/Report"
import { ClickAwayListener, DialogContentText, Grow } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  TextField,
  Typography,
} from "@mui/material"
import axios from "../../axios"
import { deletePost, editPost } from "../../features/posts/postSlice"
import SidePopup from "../SidePopup/SidePopup"

function PostMenu({ handleClickAway, checked, postOwner, postId }) {
  const user = useSelector((state) => state.user)
  const auth = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const [owner, setOwner] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const [privacy, setPrivacy] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [media, setMedia] = useState("")
  const [isImage, setIsImage] = useState(true)

  const [openConfirmation, setOpenConfirmation] = useState(false)

  const [privacyError, setPrivacyError] = useState("")
  const [descriptionError, setDescriptionError] = useState("")

  const [error, setError] = useState("")
  const [reported, setReported] = useState(false)

  const imageFormat = ["jpg", "jpeg", "png", "webp"]
  function getUrlExtension(url) {
    return url.split(/[#?]/)[0].split(".").pop().trim()
  }
  let extension
  useEffect(() => {
    if (user._id === postOwner) {
      setOwner(true)
    }
  }, [postOwner])
  const editPostHandler = async () => {
    setError("")
    setOpenEdit(true)
    setReported(false)
    try {
      const { data } = await axios.get(`/api/post/${postId}`, {
        headers: { Authorization: auth },
      })
      setError("")
      setPrivacy(data.privacy)
      if (data.description) setDescription(data.description)
      if (data.location) setLocation(data.location)
      if (data.media) {
        setMedia(data.media)
        extension = getUrlExtension(data.media)
        setIsImage(imageFormat.includes(extension))
      }
    } catch (error) {
      const { response } = error
      if (response) {
        if (response.status === 403) {
          //use snackbar
          setError("You are not authorized to do that!")
        } else {
          //use snackbar
          setError("Something went wrong, please try again later")
        }
      } else {
        console.log(error)
      }
    }
  }
  const handleSubmit = async () => {
    try {
      const { data } = await axios.patch(
        `/api/post/${postId}/edit`,
        {
          privacy,
          description,
          location,
        },
        { headers: { Authorization: auth } }
      )
      setError("")
      dispatch(editPost(data))
      setOpenEdit(false)
    } catch (error) {
      const { response } = error
      if (response) {
        if (response.status === 403) {
          //use snackbar
        } else if (response.status === 400) {
          const { data } = response
          if (data.description) setDescriptionError(data.description)
          if (data.privacy) setDescriptionError(data.privacy)
        } else {
          //use snackbar
          setError("Something went wrong, please try again later")
        }
      } else {
        console.log(error)
      }
    }
  }
  const handleClickOpenConfirmation = () => {
    setOpenConfirmation(true)
  }

  const handleCloseConfirmation = () => {
    setOpenConfirmation(false)
  }
  const handleDelete = async () => {
    setError("")
    try {
      const { data } = await axios.patch(
        `/api/post/${postId}/delete`,
        {},
        { headers: { Authorization: auth } }
      )
      setError("")
      dispatch(deletePost(data))
      setOpenConfirmation(false)
    } catch (error) {
      const { response } = error
      if (response) {
        if (response.status === 403) {
          //snackbar
          setError("You are not authorized to do that!")
        } else {
          //snackbar
          setError("Something went wrong, please try again later")
        }
      } else {
        console.log(error)
      }
    }
  }
  const reportPostHandler = async () => {
    try {
      setError("")
      setReported(false)
      const { data } = await axios.patch(
        `/api/post/${postId}/report`,
        {},
        { headers: { Authorization: auth } }
      )
      setError("")
      setReported(true)
    } catch (error) {
      const { response } = error
      if (response) {
        if (response.status === 403) {
          setError("You cannot report your own post")
        } else {
          setError("Something went wrong, please try again later")
        }
      }
      console.log(error)
    }
  }
  return (
    <>
      <ClickAwayListener onClickAway={handleClickAway} mouseEvent="onMouseUp">
        <Box>
          <Grow
            in={checked}
            style={{ transformOrigin: "0 0 0" }}
            {...(checked ? { timeout: 250 } : {})}
          >
            <Paper
              sx={{
                width: 140,
                maxWidth: "100%",
                position: "absolute",
                top: 50,
                right: 20,
              }}
            >
              <MenuList>
                {owner ? (
                  [
                    <MenuItem onClick={editPostHandler} key={1}>
                      <ListItemIcon>
                        <EditIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Edit</ListItemText>
                    </MenuItem>,
                    <MenuItem key={2} onClick={handleClickOpenConfirmation}>
                      <ListItemIcon>
                        <DeleteIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Delete</ListItemText>
                    </MenuItem>,
                  ]
                ) : (
                  <MenuItem onClick={reportPostHandler}>
                    <ListItemIcon>
                      <ReportIcon fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Report</ListItemText>
                  </MenuItem>
                )}
              </MenuList>
            </Paper>
          </Grow>
          <Dialog
            open={openEdit}
            onClose={() => setOpenEdit(false)}
            fullWidth
            maxWidth="sm"
          >
            <DialogTitle>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Typography sx={{ fontWeight: 700, fontSize: "1.5rem" }}>
                  Edit Post
                </Typography>
                <FormControl
                  sx={{ width: "7rem" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <InputLabel
                    id="demo-simple-select-label"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Privacy
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    label="Privacy"
                    value={privacy}
                    onChange={(e) => {
                      setPrivacy(e.target.value)
                      setPrivacyError("")
                    }}
                    error={!!privacyError}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MenuItem value={"public"}>Public</MenuItem>
                    <MenuItem value={"private"}>Private</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </DialogTitle>
            <DialogContent>
              <TextField
                variant="standard"
                label="Add a description"
                fullWidth
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value)
                  setDescriptionError("")
                }}
                error={!!descriptionError}
                helperText={descriptionError}
              />
              {media && (
                <Box
                  sx={{
                    width: "100%",
                    height: "15rem",
                    mt: 2,
                    mb: 2,
                    objectFit: "cover",
                  }}
                  component={isImage ? "img" : "video"}
                  src={media}
                />
              )}
              <TextField
                autoFocus
                margin="dense"
                id="location"
                label="Location"
                type="text"
                fullWidth
                variant="standard"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </DialogContent>
            <DialogActions sx={{ display: "flex", flexDirection: "column" }}>
              <Button
                sx={{ mb: 3 }}
                variant="contained"
                fullWidth
                onClick={handleSubmit}
              >
                Save
              </Button>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => {
                  setOpenEdit(false)
                }}
              >
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            open={openConfirmation}
            onClose={handleCloseConfirmation}
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle>Delete Post Confirmation</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-slide-description">
                Are you sure you want to delete this post? You won't be able to
                recover deleted posts.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseConfirmation}>Cancel</Button>
              <Button color="error" onClick={handleDelete}>
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </ClickAwayListener>
      <SidePopup message={error} type={"error"} show={!!error} />
      <SidePopup message={"Post Reported"} type={"info"} show={reported} />
    </>
  )
}

export default PostMenu
