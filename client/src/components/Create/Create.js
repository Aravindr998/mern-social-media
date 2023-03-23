import React, { useRef, useState } from "react"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"
import CardActions from "@mui/material/CardActions"
import Avatar from "@mui/material/Avatar"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import { Box } from "@mui/system"
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
} from "@mui/material"
import ImageIcon from "@mui/icons-material/Image"
import axios from "../../axios"
import { useSelector } from "react-redux"

function Create() {
  const fileRef = useRef()
  const auth = useSelector((state) => state.auth)
  const [description, setDescription] = useState("")
  const [image, setImage] = useState("")
  const [error, setError] = useState(false)
  const [success, setSuccess] = useState(false)
  const [location, setLocation] = useState("")
  const [privacy, setPrivacy] = useState("")
  const [open, setOpen] = useState(false)
  const [file, setFile] = useState(null)
  const [privacyError, setPrivacyError] = useState("")
  const [descriptionError, setDescriptionError] = useState("")
  const handleClickOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setImage("")
    setLocation("")
    setDescription("")
    setPrivacy("")
    setOpen(false)
    setFile(null)
  }
  const handleSubmit = (e) => {
    e.preventDefault()
    setError(false)
    setSuccess(false)
    const formData = new FormData()
    formData.append("description", description)
    formData.append("location", location)
    formData.append("privacy", privacy)
    console.log("here")
    if (file?.files?.length > 0) {
      console.log("here")
      formData.append("post", file.files[0], file.files[0].name)
    }
    axios
      .post("/api/post/create", formData, {
        headers: { Authorization: auth, "Content-Type": "multipart/form-data" },
      })
      .then(({ data }) => {
        setImage("")
        setLocation("")
        setDescription("")
        setPrivacy("")
        setOpen(false)
        setSuccess(true)
        setFile(null)
      })
      .catch(({ response }) => {
        console.log(response)
        if (response.status === 400) {
          const { data } = response
          if (data.errors.privacy) {
            setPrivacyError(data.errors.privacy)
          } else {
            setDescriptionError(data.errors.description)
          }
        } else {
          setError(true)
        }
      })
  }

  return (
    <>
      <Card sx={{ width: { xs: "90%", sm: "50%" }, marginBottom: "1rem" }}>
        <CardContent>
          <Box sx={{ display: "flex" }}>
            <Avatar sx={{ marginRight: "1rem" }} aria-label="recipe">
              R
            </Avatar>
            <TextField
              label="What's on your mind?"
              variant="filled"
              fullWidth
              multiline
              rows={3}
            />
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ display: "flex", justifyContent: "space-around" }}>
          <IconButton aria-label="live">
            <Box
              component="img"
              sx={{ width: "1.5rem", marginRight: 1 }}
              alt="Live"
              src="/images/live-streaming.png"
            />
            <Typography>Go Live!</Typography>
          </IconButton>
          <IconButton aria-label="post" onClick={handleClickOpen}>
            <Box
              component="img"
              sx={{ width: "1.5rem", marginRight: 1 }}
              alt="Live"
              src="/images/gallery.png"
            />
            <Typography>Photo/Video</Typography>
          </IconButton>
          <IconButton aria-label="activity">
            <Box
              component="img"
              sx={{ width: "1.5rem", marginRight: 1 }}
              alt="Live"
              src="/images/winking-face.png"
            />
            <Typography>Feeling/Activity</Typography>
          </IconButton>
        </CardActions>
      </Card>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography sx={{ fontWeight: 700, fontSize: "1.5rem" }}>
              Create Post
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
                  setPrivacyError("")
                }}
                error={!!privacyError}
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
          {!image ? (
            <Button
              sx={{
                width: "100%",
                height: "15rem",
                mt: 2,
                mb: 2,
              }}
              component="label"
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ImageIcon />
                Add Photos/Videos
              </Box>
              <input
                type="file"
                hidden
                ref={fileRef}
                onChange={(e) => {
                  setImage(URL.createObjectURL(e.target.files[0]))
                  setFile(fileRef.current)
                }}
              />
            </Button>
          ) : (
            <Box
              sx={{ width: "100%", height: "15rem", mt: 2, mb: 2 }}
              component="img"
              src={image}
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
            Post
          </Button>
          <Button fullWidth variant="outlined" onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={error}
        autoHideDuration={6000}
        onClose={() => setError(false)}
        severity="error"
      >
        <Alert severity="error" sx={{ width: "100%" }}>
          Something went wrong, Please try again later
        </Alert>
      </Snackbar>
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={() => setSuccess(false)}
        message="Posted Successfully"
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          Posted Successfully
        </Alert>
      </Snackbar>
    </>
  )
}

export default Create
