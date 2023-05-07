import React, { useEffect, useState } from "react"
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  Menu,
  MenuItem,
  Select,
  TextField,
  Typography,
  alpha,
} from "@mui/material"
import ArchiveIcon from "@mui/icons-material/Archive"
import styled from "@emotion/styled"
import PostAddIcon from "@mui/icons-material/PostAdd"
import ThreePIcon from "@mui/icons-material/ThreeP"
import axios from "../../axios"
import { useDispatch, useSelector } from "react-redux"
import SidePopup from "../SidePopup/SidePopup"
import { addPost } from "../../features/posts/postSlice"
import { socket } from "../../socket"

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}))

const ShareOptions = ({ anchorEl, handleShareClose, postId, shared }) => {
  const auth = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const [openDialog, setOpenDialog] = useState(false)
  const [description, setDescription] = useState("")
  const [privacy, setPrivacy] = useState("")
  const [privacyError, setPrivacyError] = useState(false)
  const [post, setPost] = useState({})
  const [error, setError] = useState(false)
  const [message, setMessage] = useState("")
  const [open, setOpen] = useState(false)
  const [saved, setSaved] = useState(false)
  useEffect(() => {
    setOpen(Boolean(anchorEl))
  }, [anchorEl])
  const fromatter = new Intl.DateTimeFormat("en-GB", { dateStyle: "full" })
  const handleDialogClose = () => {
    setOpenDialog(false)
  }
  const handleClose = () => {
    setOpen(false)
    handleShareClose()
  }
  let sharedPostId = postId
  const handleSharePost = async () => {
    try {
      setError(false)
      if (shared) {
        const { data } = await axios.get(`/api/post/${postId}/post/share`, {
          headers: { Authorization: auth },
        })
        sharedPostId = data
      }
      const { data } = await axios.get(`/api/post/${sharedPostId}/post`, {
        headers: { Authorization: auth },
      })
      setPost(data)
      setOpenDialog(true)
    } catch (error) {
      const { response } = error
      if (response) {
        if (response.status === 403) setMessage("Cannot share private posts")
        else setMessage("Something went wrong please try again later")
        setError(true)
      }
    }
  }

  const handleSubmit = async () => {
    try {
      setError(false)
      const { data } = await axios.post(
        "/api/post/share",
        { privacy, description, sharedPostId, shared },
        { headers: { Authorization: auth } }
      )
      dispatch(addPost(data.post))
      socket.emit("postInteracted", data.notification)
      setOpenDialog(false)
      setOpen(false)
    } catch (error) {
      const { response } = error
      if (response) {
        if (response.status === 400) {
          const { data } = response
          if (data.privacy) setPrivacyError(true)
          if (data.description) setDescription(data.description)
        } else {
          setMessage("Something went wrong, please try again later")
          setError(true)
        }
      }
    }
  }

  const handleSave = async () => {
    setSaved(false)
    try {
      const { data } = await axios.patch(
        "/api/post/save",
        { postId },
        { headers: { Authorization: auth } }
      )
      setSaved(true)
      handleClose()
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <>
      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleSharePost} disableRipple>
          <PostAddIcon />
          Share as post
        </MenuItem>
        <MenuItem onClick={handleClose} disableRipple>
          <ThreePIcon />
          Share as message
        </MenuItem>
        <Divider sx={{ my: 0.5 }} />
        <MenuItem onClick={handleSave} disableRipple>
          <ArchiveIcon />
          Save
        </MenuItem>
      </StyledMenu>
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography sx={{ fontWeight: 700, fontSize: "1.5rem" }}>
              Share Post
            </Typography>
            <FormControl sx={{ width: "7rem" }}>
              <InputLabel id="demo-simple-select-label">Privacy</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Privacy"
                value={privacy}
                onChange={(e) => {
                  setPrivacy(e.target.value)
                  setPrivacyError(false)
                }}
                error={privacyError}
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
            }}
            sx={{ marginBottom: "1rem" }}
          />
          <Box sx={{ border: "1px solid #CFCFCF", borderRadius: "1rem" }}>
            <Box
              sx={
                post?.media
                  ? {
                      width: "25rem",
                      height: "15rem",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      margin: "2rem",
                    }
                  : {
                      width: "25rem",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                      margin: "2rem",
                    }
              }
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginBlock: "1rem",
                }}
              >
                <Avatar
                  src={post?.createdBy?.profilePicture}
                  sx={{ marginRight: "0.5rem" }}
                />
                <Box>
                  <Typography fontSize="0.9rem" fontWeight={500}>
                    {post?.createdBy?.username}
                  </Typography>
                  {post?.createdAt && (
                    <Typography fontSize="0.7rem">
                      {fromatter.format(new Date(post?.createdAt))}
                    </Typography>
                  )}
                </Box>
              </Box>
              {post?.description && (
                <Box>
                  <Typography>{post?.description}</Typography>
                </Box>
              )}
              {post?.media && (
                <Box sx={{ marginBottom: "0.5rem", maxHeight: "100%" }}>
                  <Box
                    sx={{
                      width: "100%",
                      maxHeight: "90%",
                      objectFit: "cover",
                    }}
                    component="img"
                    src={post?.media}
                  />
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ display: "flex", flexDirection: "column" }}>
          <Button
            sx={{ mb: 3 }}
            variant="contained"
            fullWidth
            onClick={handleSubmit}
          >
            Share as Post
          </Button>
          <Button fullWidth variant="outlined" onClick={handleDialogClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <SidePopup message={message} show={error} type={"error"} />
      <SidePopup message={"Post saved"} show={saved} type={"success"} />
    </>
  )
}

export default ShareOptions
