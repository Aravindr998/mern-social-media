import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  TextField,
  Typography,
} from "@mui/material"
import axios from "../../axios"
import React, { forwardRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { fetchMessages } from "../../features/messages/messageSlice"

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />
})

const GroupChatDetail = ({ show, close }) => {
  const messages = useSelector((state) => state.messages)
  const userState = useSelector((state) => state.user)
  const auth = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { conversationId } = useParams()
  const [search, setSearch] = useState("")
  const [result, setResult] = useState([])
  const handleClose = () => {
    close()
  }
  const removeHandler = (userId) => {
    axios
      .put(
        `/api/conversation/${conversationId}/remove`,
        { userId },
        { headers: { Authorization: auth } }
      )
      .then(({ data }) => {
        console.log(data)
        dispatch(fetchMessages(conversationId))
      })
      .catch((error) => {
        console.log(error)
      })
  }
  const groupChatSearchHandler = (e) => {
    setSearch(e.target.value)
    axios
      .get(`/api/conversation/${conversationId}/search?key=${search}`, {
        headers: { Authorization: auth },
      })
      .then(({ data }) => {
        setResult(data)
      })
      .catch((error) => {
        console.log(error)
      })
  }
  const addUserHandler = (userId) => {
    axios
      .put(
        `/api/conversation/${conversationId}/user/add`,
        { userId },
        { headers: { Authorization: auth } }
      )
      .then(({ data }) => {
        setSearch("")
        dispatch(fetchMessages(conversationId))
      })
      .catch((error) => {
        console.log(error)
      })
  }
  const searchResults = result.map((item) => {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
          padding: "1rem",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
          }}
        >
          <Avatar sx={{ marginRight: "0.5rem" }} />
          <Typography>{item.username}</Typography>
        </Box>
        <Button variant="outlined" onClick={() => addUserHandler(item._id)}>
          Add
        </Button>
      </Box>
    )
  })
  let users = messages?.messages?.users?.map((user) => {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "0.7rem",
          minWidth: "18rem",
        }}
        key={user._id}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <Avatar />
          <Typography sx={{ marginInline: "0.7rem" }} fontWeight={500}>
            {user._id === userState?._id ? "You" : user.username}
          </Typography>
        </Box>
        {(messages?.messages?.groupAdmin === userState?._id ||
          user._id === userState?._id) && (
          <Button
            variant="text"
            color="error"
            onClick={() => removeHandler(user._id)}
          >
            {user._id === userState?._id ? "Leave" : "Remove"}
          </Button>
        )}
      </Box>
    )
  })
  return (
    <Dialog
      open={show}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="Group conversation details"
    >
      <DialogTitle
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Avatar sx={{ marginRight: "0.5rem" }} />
        {messages?.messages?.chatName}
      </DialogTitle>
      <DialogContent>
        <Box>
          <Typography fontSize={"0.9rem"} fontWeight={500}>
            Members
          </Typography>
          {users}
        </Box>
      </DialogContent>
      {messages?.messages?.groupAdmin === userState?._id && (
        <DialogActions
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-around",
            marginBottom: "1rem",
          }}
        >
          <Box sx={{ position: "relative" }}>
            <TextField
              placeholder="Add Participants"
              sx={{ padding: "0.5rem !important" }}
              onChange={groupChatSearchHandler}
              value={search}
              // onBlur={() => setResult([])}
            />
            {search && (
              <Box
                sx={{
                  backgroundColor: "white",
                  position: "absolute",
                  top: 70,
                  left: 0,
                  right: 0,
                }}
              >
                {searchResults}
              </Box>
            )}
          </Box>
        </DialogActions>
      )}
    </Dialog>
  )
}

export default GroupChatDetail
