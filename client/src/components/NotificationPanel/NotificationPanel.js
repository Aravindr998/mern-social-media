import React, { useEffect, useState } from "react"
import Divider from "@mui/material/Divider"
import MenuList from "@mui/material/MenuList"
import MenuItem from "@mui/material/MenuItem"
import ListItemText from "@mui/material/ListItemText"
import Typography from "@mui/material/Typography"
import { Box, Menu, Skeleton } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import { fetchNotifications } from "../../features/notifications/notificationSlice"
import { useNavigate } from "react-router-dom"

const NotificationPanel = ({ anchorEl, handleNotificationClose }) => {
  const [open, setOpen] = useState(false)
  const notifications = useSelector((state) => state.notifications)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  useEffect(() => {
    setOpen(Boolean(anchorEl))
  }, [anchorEl])
  const handleClose = () => {
    setOpen(false)
    handleNotificationClose()
  }
  useEffect(() => {
    dispatch(fetchNotifications())
  }, [])
  let allNotifications = (
    <Box>
      <MenuItem>
        <ListItemText>
          <Skeleton width={"100%"} />
        </ListItemText>
      </MenuItem>
      <Divider />
      <MenuItem>
        <ListItemText>
          <Skeleton width={"100%"} />
        </ListItemText>
      </MenuItem>
      <Divider />
      <MenuItem>
        <ListItemText>
          <Skeleton width={"100%"} />
        </ListItemText>
      </MenuItem>
      <Divider />
    </Box>
  )
  if (notifications?.notifications?.length && !notifications?.loading) {
    const slicedNotification = notifications.notifications.slice(0, 8)
    allNotifications = slicedNotification?.map((item) => {
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
      }
      return [
        <MenuItem onClick={() => navigate(link)} key={item._id}>
          <ListItemText>
            <Typography>
              <Typography component="span" fontWeight={700}>
                {username}
              </Typography>{" "}
              {content}
            </Typography>
          </ListItemText>
        </MenuItem>,
        <Divider key={item._id + "1"} />,
      ]
    })
  } else if (!notifications?.notifications?.length && !notifications?.loading) {
    allNotifications = [
      <MenuItem key={1}>
        <ListItemText>
          <Typography fontWeight={500} sx={{ textAlign: "center" }}>
            No notifications to show
          </Typography>
        </ListItemText>
      </MenuItem>,
      <Divider key={2} />,
    ]
  }
  return (
    <Menu
      PaperProps={{ sx: { width: 420 } }}
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      disableScrollLock={true}
    >
      <MenuList>
        {allNotifications}
        <MenuItem
          onClick={() => {
            navigate("/notifications")
          }}
        >
          <ListItemText sx={{ textAlign: "center" }}>
            <Typography fontWeight={500}>View All Notifications</Typography>
          </ListItemText>
        </MenuItem>
      </MenuList>
    </Menu>
  )
}

export default NotificationPanel
