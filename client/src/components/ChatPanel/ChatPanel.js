import React, { useEffect, useState } from "react"
import Divider from "@mui/material/Divider"
import MenuList from "@mui/material/MenuList"
import MenuItem from "@mui/material/MenuItem"
import ListItemText from "@mui/material/ListItemText"
import Typography from "@mui/material/Typography"
import { Avatar, Box, Menu, Skeleton } from "@mui/material"
import { useDispatch, useSelector } from "react-redux"
import { fetchNotifications } from "../../features/notifications/notificationSlice"
import { useNavigate } from "react-router-dom"
import { fetchCoversations } from "../../features/conversations/conversationSlice"

const ChatPanel = ({ anchorEl, handleChatClose }) => {
  const [open, setOpen] = useState(false)
  const conversations = useSelector((state) => state.conversations)
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  useEffect(() => {
    setOpen(Boolean(anchorEl))
  }, [anchorEl])
  const handleClose = () => {
    setOpen(false)
    handleChatClose()
  }
  useEffect(() => {
    dispatch(fetchCoversations())
  }, [])
  let allConversations = (
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
  if (conversations?.conversations?.length && !conversations?.loading) {
    allConversations = conversations?.conversations?.map((details) => {
      let senderName =
        details?.users[0]?._id !== user?._id
          ? details?.users[0]?.username
          : details?.users[1]?.username
      let profilePicture = details.isGroupChat
        ? details.groupChatImage
        : details?.users[0]?._id !== user?._id
        ? details?.users[0]?.profilePicture
        : details?.users[1]?.profilePicture
      return [
        <MenuItem key={details._id}>
          <ListItemText>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Avatar src={profilePicture} sx={{ marginRight: "0.5rem" }} />
              <Box>
                <Typography fontWeight={700}>
                  {details?.isGroupChat ? details?.chatName : senderName}
                </Typography>
                {details?.sender && (
                  <Typography fontSize={12}>
                    {details?.sender?._id === user?._id
                      ? "You: "
                      : details?.sender?.username + ": "}
                    {details?.message}
                  </Typography>
                )}
              </Box>
            </Box>
          </ListItemText>
        </MenuItem>,
        <Divider key={details._id + "1"} />,
      ]
    })
  } else if (!conversations?.conversations?.length && !conversations?.loading) {
    allConversations = [
      <MenuItem key={1}>
        <ListItemText>
          <Typography fontWeight={500} sx={{ textAlign: "center" }}>
            No conversations to show
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
        {allConversations}
        <MenuItem
          onClick={() => {
            navigate("/conversations")
          }}
        >
          <ListItemText sx={{ textAlign: "center" }}>
            <Typography fontWeight={500}>View All Conversation</Typography>
          </ListItemText>
        </MenuItem>
      </MenuList>
    </Menu>
  )
}

export default ChatPanel
