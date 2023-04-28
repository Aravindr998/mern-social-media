import {
  Box,
  Card,
  CardContent,
  Divider,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material"
import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchNotifications } from "../../features/notifications/notificationSlice"
import { useNavigate } from "react-router-dom"

const Notifications = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const notifications = useSelector((state) => state.notifications)
  useEffect(() => {
    dispatch(fetchNotifications())
  }, [])
  let allNotifications = (
    <>
      <Box
        sx={{
          padding: "1rem",
          borderRadius: "0.5rem",
          cursor: "pointer",
        }}
      >
        <Skeleton sx={{ fontSize: "1rem" }} width={"70%"} />
      </Box>
      <Divider />
      <Box
        sx={{
          padding: "1rem",
          borderRadius: "0.5rem",
          cursor: "pointer",
        }}
      >
        <Skeleton sx={{ fontSize: "1rem" }} width={"50%"} />
      </Box>
      <Divider />
      <Box
        sx={{
          padding: "1rem",
          borderRadius: "0.5rem",
          cursor: "pointer",
        }}
      >
        <Skeleton sx={{ fontSize: "1rem" }} width={"80%"} />
      </Box>
      <Divider />
    </>
  )
  if (notifications?.notifications?.length && !notifications?.loading) {
    allNotifications = notifications?.notifications?.map((item) => {
      if (item.type === "create") {
        return (
          <React.Fragment key={item._id}>
            <Box
              sx={{
                padding: "1rem",
                "&:hover": { backgroundColor: "#DFDFDF" },
                borderRadius: "0.5rem",
                transition: "background-color 0.3s",
                cursor: "pointer",
              }}
              onClick={() => navigate(`/post/${item.postId}`)}
            >
              <Typography>
                <Typography component="span" fontWeight={700}>
                  {item.userId.username}
                </Typography>{" "}
                created a new post
              </Typography>
            </Box>
            <Divider />
          </React.Fragment>
        )
      }
    })
  } else if (!notifications?.notifications?.length && !notifications?.loading) {
    allNotifications = (
      <>
        <Box
          sx={{
            padding: "1rem",
            borderRadius: "0.5rem",
            textAlign: "center",
          }}
        >
          <Typography fontWeight={500}>No notifications</Typography>
        </Box>
        <Divider />
      </>
    )
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
        <CardContent sx={{ overflowY: "auto" }}>
          <Stack>{allNotifications}</Stack>
        </CardContent>
      </Card>
    </>
  )
}

export default Notifications
