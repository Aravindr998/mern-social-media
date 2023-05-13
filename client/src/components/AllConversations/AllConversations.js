import React, { useEffect, useRef, useState } from "react"
import {
  Autocomplete,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
  Paper,
  TextField,
  Tooltip,
  Typography,
  useMediaQuery,
} from "@mui/material"
import Conversation from "../Conversation/Conversation"
import { useDispatch, useSelector } from "react-redux"
import {
  addConversation,
  fetchCoversations,
} from "../../features/conversations/conversationSlice"
import Chat from "../Chat/Chat"
import { Outlet, useParams } from "react-router-dom"
import SelectChat from "../SelectChat/SelectChat"
import axios from "../../axios"
import { socket } from "../../socket"
import AddIcon from "@mui/icons-material/Add"

const AllConversations = () => {
  const dispatch = useDispatch()
  const { conversationId } = useParams()
  const conversations = useSelector((state) => state.conversations)
  const auth = useSelector((state) => state.auth)
  const matches = useMediaQuery("(max-width: 600px)")

  const [search, setSearch] = useState("")
  const [result, setResult] = useState([])
  const [open, setOpen] = useState(false)
  const [friends, setFriends] = useState([])
  const [members, setMembers] = useState([])
  const [name, setName] = useState("")
  const [image, setImage] = useState("/images/user.png")
  const [show, setShow] = useState(false)
  const fileRef = useRef()

  const [nameError, setNameError] = useState("")

  useEffect(() => {
    if (matches) {
      if (!conversationId) {
        setShow(true)
      } else {
        setShow(false)
      }
    } else {
      setShow(true)
    }
  }, [matches, conversationId])
  console.log(show)

  useEffect(() => {
    ;(async () => {
      try {
        const { data } = await axios.get("/api/friends", {
          headers: { Authorization: auth },
        })
        setFriends(data)
      } catch (error) {
        console.log(error)
      }
    })()
  }, [])

  useEffect(() => {
    dispatch(fetchCoversations())
    socket.on("fetchConversation", () => {
      dispatch(fetchCoversations())
    })
    return () => {
      socket.off("fetchConversation")
    }
  }, [])
  const handleSearch = (e) => {
    setSearch(e.target.value)
    axios
      .get(`/api/conversation/search/users?key=${search}`, {
        headers: { Authorization: auth },
      })
      .then(({ data }) => setResult(data))
      .catch((error) => console.log(error))
  }
  const startConversation = (userId) => {
    axios
      .post(
        "/api/conversation/create",
        { members: [userId] },
        { headers: { Authorization: auth } }
      )
      .then(({ data }) => {
        console.log(data)
        setSearch("")
        dispatch(addConversation(data))
        socket.emit("newConversation", userId)
      })
  }
  const searchResult = result.map((item) => {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          padding: "1rem",
          "&:hover": {
            backgroundColor: "#DFDFDF",
          },
          cursor: "pointer",
        }}
        onClick={() => startConversation(item._id)}
        key={item._id}
      >
        <Avatar sx={{ marginRight: "0.5rem" }} src={item.profilePicture} />
        <Typography>{item.username}</Typography>
      </Box>
    )
  })
  let conversationsList
  if (conversations.error) {
    conversationsList = "Something went wrong. Please try again later."
  } else if (conversations.conversations?.length) {
    conversationsList = conversations.conversations.map((item) => {
      return <Conversation key={item._id} details={item} />
    })
  } else {
    conversationsList = (
      <Typography textAlign={"center"} fontWeight={500}>
        No chats to show
      </Typography>
    )
  }
  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleChange = (e, value) => {
    setMembers(value)
  }

  const handleNameChange = (e) => {
    setName(e.target.value)
  }

  const handleSubmit = async () => {
    try {
      const formData = new FormData()
      console.log(members)
      const groupMembers = members.map((member) => member._id)
      formData.append("members", JSON.stringify(groupMembers))
      formData.append("isGroupChat", true)
      formData.append("chatName", name)
      if (fileRef.current.files.length) {
        formData.append(
          "groupImage",
          fileRef.current.files[0],
          fileRef.current.files[0].name
        )
      }
      const { data } = await axios.post("/api/conversation/create", formData, {
        headers: { Authorization: auth, "Content-Type": "multipart/form-data" },
      })
      dispatch(addConversation(data))
      setOpen(false)
      setMembers([])
      setName("")
      setImage("/images/user.png")
    } catch (error) {
      const { response } = error
      if (response) {
        if (response.status === 400) {
          setNameError(response.data.chatName)
        } else {
          //show snackbar
        }
      } else {
        console.log(error)
      }
    }
  }
  const handleFileChange = async (e) => {
    if (e.target.files.length) setImage(URL.createObjectURL(e.target.files[0]))
  }
  return (
    <>
      <Paper
        sx={{
          width: "100%",
          height: "82vh",
          display: "flex",
          alignItems: "center",
          padding: "0.5rem",
          justifyContent: "flex-end",
        }}
      >
        {conversationId ? <Outlet /> : <SelectChat />}
        {show && (
          <>
            <Box
              sx={{
                width: { xs: "100%", sm: "30%" },
                height: "90%",
                borderLeft: "solid 1px #DFDFDF",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  marginBottom: "1rem",
                  position: "relative",
                }}
              >
                <TextField
                  placeholder="New Conversation"
                  sx={{ width: "90%" }}
                  variant="standard"
                  value={search}
                  onChange={handleSearch}
                />
                {search && (
                  <Box
                    sx={{
                      position: "absolute",
                      backgroundColor: "white",
                      top: 32,
                      left: 0,
                      right: 0,
                      zIndex: 2,
                    }}
                  >
                    {searchResult}
                  </Box>
                )}
              </Box>
              {conversationsList}
            </Box>
            <Tooltip title="Create Group Conversation" placement="left">
              <Fab
                size="medium"
                color="primary"
                aria-label="add"
                sx={{ position: "fixed", bottom: 45, right: 35 }}
                onClick={handleClickOpen}
              >
                <AddIcon />
              </Fab>
            </Tooltip>
          </>
        )}
      </Paper>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Create Group Chat"}</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              minWidth: "25rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: "1rem",
            }}
          >
            <Avatar src={image} />
            <Button
              component="label"
              sx={{ marginBlock: "1rem" }}
              variant="outlined"
            >
              Add Image
              <input
                type="file"
                hidden
                onChange={handleFileChange}
                accept="image/png, image/jpeg, image/webp"
                ref={fileRef}
              />
            </Button>
            <TextField
              variant="filled"
              fullWidth
              label="Conversation name"
              value={name}
              onChange={handleNameChange}
              error={!!nameError}
              helperText={nameError}
            />
          </Box>
          <Box>
            <Typography fontWeight={500}>Members</Typography>
            <Autocomplete
              multiple
              id="tags-standard"
              options={friends}
              getOptionLabel={(option) => option.username}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="filled"
                  label="Select Members"
                  placeholder="Members"
                />
              )}
              value={members}
              onChange={handleChange}
              getOptionDisabled={(option) => {
                if (
                  members.some((member) => member.username === option.username)
                )
                  return true
                return false
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="error" variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleSubmit} autoFocus variant="contained">
            Create Group
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default AllConversations
