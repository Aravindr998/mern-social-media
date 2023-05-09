import {
  Box,
  Card,
  CardContent,
  Divider,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material"
import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  changeReadState,
  fetchNotifications,
  loadMoreNotifications,
} from "../../features/notifications/notificationSlice"
import { useNavigate } from "react-router-dom"
import InfiniteScroll from "react-infinite-scroller"
import { useTheme } from "@emotion/react"

const Notifications = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const notifications = useSelector((state) => state.notifications)
  const [pageNumber, setPageNumber] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const theme = useTheme()
  const backgroundColor = theme.palette.mode === "dark" ? "#4e4f4f" : "#DFDFDF"
  useEffect(() => {
    dispatch(fetchNotifications())
  }, [])
  useEffect(() => {
    dispatch(changeReadState())
  }, [])
  useEffect(() => {
    if (notifications.total <= notifications.notifications.length) {
      setHasMore(false)
    } else {
      setHasMore(true)
    }
  }, [notifications.notifications])
  const loadHandler = () => {
    if (
      !notifications.loading &&
      pageNumber <= Math.ceil(notifications.total / 10)
    ) {
      setPageNumber((prevState) => {
        dispatch(loadMoreNotifications(prevState))
        return ++prevState
      })
    }
  }
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
  console.log(notifications)
  if (notifications?.notifications?.length && !notifications?.loading) {
    allNotifications = notifications?.notifications?.map((item) => {
      let content, link, username
      if (item.type === "create") {
        username = item.userId.username
        content = "created a new post"
        link = `/post/${item.postId._id}`
      } else if (item.type === "post") {
        username = item.userId.username
        content = `${item.interaction} your post`
        link = `/post/${item.postId._id}`
      } else if (item.type === "friendRequest") {
        username = item.userId.username
        content = `sent you a friend request`
        link = `/profile/${item.userId.username}`
      } else if (item.type === "acceptedRequest") {
        username = item.userId.username
        content = `accepted your friend request`
        link = `/profile/${item.userId.username}`
      } else if (item.type === "live") {
        username = item.userId.username
        content = `started a live stream`
        link = `/room/${item.roomId}`
      } else if (item.type === "payment") {
        content = `Your subscription is about to expire. If autopay is configured, you will be automatically charged`
        link = `/elite/plans`
      }
      return (
        <React.Fragment key={item._id}>
          <Box
            sx={{
              padding: "1rem",
              "&:hover": { backgroundColor: backgroundColor },
              borderRadius: "0.5rem",
              transition: "background-color 0.3s",
              cursor: "pointer",
            }}
            onClick={() => navigate(link)}
          >
            <Typography>
              <Typography component="span" fontWeight={700}>
                {username}
              </Typography>{" "}
              {content}
            </Typography>
          </Box>
          <Divider />
        </React.Fragment>
      )
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
          height: "85vh",
          padding: "0.5rem",
        }}
      >
        <CardContent sx={{ height: "100%" }}>
          <Stack sx={{ height: "100%", overflowY: "auto" }} key={1}>
            <InfiniteScroll
              pageStart={0}
              loadMore={loadHandler}
              hasMore={hasMore}
              loader={
                <React.Fragment key={1}>
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
                </React.Fragment>
              }
            >
              {allNotifications}
            </InfiniteScroll>
          </Stack>
        </CardContent>
      </Card>
    </>
  )
}

export default Notifications
