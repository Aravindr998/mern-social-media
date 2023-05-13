import React, { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  Skeleton,
  Stack,
  Box,
  Avatar,
  Typography,
  Button,
} from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import {
  fetchFriends,
  removeFriends,
} from "../../features/friends/friendsSlice"
import { useNavigate } from "react-router-dom"
import { useTheme } from "@emotion/react"
import axios from "../../axios"

const Friends = () => {
  const dispatch = useDispatch()
  const friends = useSelector((state) => state.friends)
  const navigate = useNavigate()
  const theme = useTheme()
  const auth = useSelector((state) => state.auth)
  useEffect(() => {
    dispatch(fetchFriends())
  }, [])
  const backgroundColor = theme.palette.mode === "dark" ? "#4e4f4f" : "#DFDFDF"

  const handleUnfriend = async (friendId) => {
    console.log(friendId)
    try {
      await axios.patch(
        "/api/friend/change",
        { id: friendId },
        { headers: { Authorization: auth } }
      )
      dispatch(removeFriends(friendId))
    } catch (error) {
      console.log(error)
    }
  }
  let allFriends = (
    <>
      <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
        <Skeleton
          variant="circular"
          sx={{ marginRight: "0.5rem" }}
          width={40}
          height={40}
        />
        <Skeleton variant="text" width={150} />
      </Box>
      <Box sx={{ display: "flex", alignItems: "center", width: "100%" }}>
        <Skeleton
          variant="circular"
          sx={{ marginRight: "0.5rem" }}
          width={40}
          height={40}
        />
        <Skeleton variant="text" width={100} />
      </Box>
    </>
  )
  if (friends?.friends?.length && !friends?.loading) {
    allFriends = friends.friends.map((friend) => {
      return (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            cursor: "pointer",
            "&:hover": { backgroundColor },
            padding: "0.5rem",
            borderRadius: "0.5rem",
            transition: "background-color 0.3s",
            justifyContent: "space-between",
          }}
          key={friend._id}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
            }}
            onClick={() => navigate(`/profile/${friend.username}`)}
          >
            <Avatar
              sx={{ marginRight: "0.5rem" }}
              src={friend.profilePicture}
            />
            <Typography fontSize={"0.9rem"} fontWeight={500}>
              {friend.username}
            </Typography>
          </Box>
          <Button
            color="error"
            variant="outlined"
            onClick={() => handleUnfriend(friend._id)}
          >
            Unfriend
          </Button>
        </Box>
      )
    })
  }
  return (
    <>
      <Card
        sx={{
          width: { xs: "90%", lg: "50%" },
          height: "82vh",
          padding: "0.5rem",
        }}
      >
        <CardContent sx={{ height: "100%" }}>
          <Stack spacing={2} sx={{ height: "100%", overflowY: "auto" }}>
            {allFriends}
          </Stack>
        </CardContent>
      </Card>
    </>
  )
}

export default Friends
