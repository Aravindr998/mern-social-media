import {
  Avatar,
  Card,
  CardContent,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material"
import { Box } from "@mui/system"
import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchOnlineUsers } from "../../features/onlineUsersSlice/onlineUsersSlice"

function ActivePanel() {
  const dispatch = useDispatch()
  const onlineUsers = useSelector((state) => state.onlineUsers)
  useEffect(() => {
    dispatch(fetchOnlineUsers())
  }, [])
  let users = (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Skeleton
        variant="circular"
        width={40}
        height={40}
        sx={{ marginRight: "0.7rem" }}
      />
      <Skeleton variant="text" sx={{ fontSize: "1rem" }} width={150} />
    </Box>
  )
  if (onlineUsers?.users?.length && !onlineUsers?.loading) {
    users = onlineUsers?.users?.map((user) => {
      console.log(user)
      return (
        <Box sx={{ display: "flex", alignItems: "center" }} key={user._id}>
          <Avatar
            sx={{ marginRight: "0.7rem" }}
            src={user.userId.profilePicture}
          />
          <Typography fontWeight={500}>{user.userId.username}</Typography>
        </Box>
      )
    })
  } else if (!onlineUsers?.users?.length && !onlineUsers?.loading) {
    users = (
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Typography fontWeight={500}>No users active</Typography>
      </Box>
    )
  }
  return (
    <Card
      sx={{
        position: "fixed",
        top: 100,
        right: 20,
        width: "23%",
        height: "82vh",
        padding: "1rem",
        display: { xs: "none", lg: "block" },
      }}
    >
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <Typography sx={{ color: "green", fontWeight: 700 }}>
            Active
          </Typography>
        </Box>
        <Stack spacing={2}>{users}</Stack>
      </CardContent>
    </Card>
  )
}

export default ActivePanel
