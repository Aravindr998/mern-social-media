import React, { useEffect, useState } from "react"
import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import IconButton from "@mui/material/IconButton"
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  Divider,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
} from "@mui/material"
import ChatIcon from "@mui/icons-material/Chat"
import NotificationsIcon from "@mui/icons-material/Notifications"
import MenuIcon from "@mui/icons-material/Menu"
import axios from "../../axios"
import { useDispatch, useSelector } from "react-redux"
import { TOKEN_KEY } from "../../constants/constant"
import { clearAuth } from "../../features/users/authSlice"
import { useNavigate } from "react-router-dom"
import { setUser } from "../../features/users/userSlice"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import EditIcon from "@mui/icons-material/Edit"
import InfoIcon from "@mui/icons-material/Info"
import LightModeIcon from "@mui/icons-material/LightMode"
import DarkModeIcon from "@mui/icons-material/DarkMode"
import LogoutIcon from "@mui/icons-material/Logout"
import NotificationPanel from "../NotificationPanel/NotificationPanel"
import ChatPanel from "../ChatPanel/ChatPanel"
import {
  changeReadState,
  fetchNotifications,
} from "../../features/notifications/notificationSlice"

function Navbar() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const auth = useSelector((state) => state.auth)
  const user = useSelector((state) => state.user)
  const notifications = useSelector((state) => state.notifications)
  const [search, setSearch] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState([])
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null)
  const [chatAnchorEl, setChatAnchorEl] = useState(null)
  const [unread, setUnread] = useState(0)
  useEffect(() => {
    dispatch(fetchNotifications())
  }, [])
  useEffect(() => {
    if (notifications.readByCount !== undefined) {
      setUnread(notifications.readByCount)
    }
  }, [notifications.readByCount])

  const handleOpenNotification = (event) => {
    dispatch(changeReadState())
    setNotificationAnchorEl(event.currentTarget)
  }
  const handleCloseNotification = () => {
    setNotificationAnchorEl(null)
  }

  const handleOpenChat = (event) => {
    setChatAnchorEl(event.currentTarget)
  }
  const handleCloseChat = (event) => {
    setChatAnchorEl(null)
  }

  const handleLogout = () => {
    localStorage.removeItem(TOKEN_KEY)
    dispatch(clearAuth())
    navigate("/login")
  }
  let searchResult
  if (result.length > 0) {
    searchResult = result.map((user) => {
      return (
        <React.Fragment key={user._id}>
          <Box
            sx={{
              textTransform: "none",
              marginLeft: "0",
              display: "flex",
              padding: "0.75rem",
              alignItems: "center",
              "&:hover": {
                backgroundColor: "#EFEFEF",
              },
              borderRadius: "0.5rem",
              cursor: "pointer",
            }}
            // variant="plain"
            // fullWidth
            onClick={() => {
              navigate(`/profile/${user.username}`)
            }}
          >
            <Avatar src={user.profilePicture} sx={{ marginRight: "0.5rem" }} />
            {user.username}
          </Box>
          <Divider />
        </React.Fragment>
      )
    })
  } else {
    searchResult = <Typography>No Match Found</Typography>
  }
  useEffect(() => {
    axios
      .get("/api/user/details", { headers: { Authorization: auth } })
      .then(({ data }) => {
        dispatch(setUser(data))
      })
      .catch(({ response }) => {
        if (response.status === 401) {
          localStorage.removeItem(TOKEN_KEY)
          dispatch(clearAuth())
          navigate("/login")
        }
      })
  }, [])

  const handleSearch = (e) => {
    const { value } = e.target
    if (!loading) {
      setSearch(true)
      setLoading(true)
      axios
        .get(`/api/users/search?key=${value}`, {
          headers: { Authorization: auth },
        })
        .then(({ data }) => {
          setLoading(false)
          setResult(data.result)
        })
        .catch((error) => console.log(error))
    }
  }

  const [anchorElNav, setAnchorElNav] = React.useState(null)
  const [anchorElUser, setAnchorElUser] = React.useState(null)
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget)
  }
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseNavMenu = () => {
    setAnchorElNav(null)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }
  return (
    <Box>
      <AppBar position="fixed" sx={{ zIndex: 2 }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box>
            <Typography
              variant="h6"
              component="div"
              sx={{
                flexGrow: 1,
                fontSize: "1.8rem",
                fontFamily: "Autumn in November",
                cursor: "pointer",
              }}
              onClick={() => navigate("/")}
            >
              vibee
            </Typography>
          </Box>
          <Box sx={{ position: "relative" }}>
            <TextField
              margin="normal"
              fullWidth
              name={Math.random().toString()}
              id={Math.random().toString()}
              label="Search"
              type="search"
              autoComplete="off"
              variant="outlined"
              sx={{
                backgroundColor: "white",
                borderRadius: "2rem",
                width: { xs: "100%", lg: "30rem" },
                display: { xs: "none", sm: "flex" },
              }}
              onChange={handleSearch}
              // onBlur={() => setSearch(false)}
            />
            {search && (
              <>
                <Card sx={{ position: "absolute", left: 0, right: 0, top: 75 }}>
                  <CardContent>
                    {loading ? (
                      <Button loading="true" variant="plain">
                        Loading
                      </Button>
                    ) : (
                      searchResult
                    )}
                  </CardContent>
                </Card>
                <Box
                  sx={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    bgcolor: "rgba(0,0,0,0)",
                    zIndex: -3,
                  }}
                  onClick={() => setSearch(false)}
                ></Box>
              </>
            )}
          </Box>
          <Box sx={{ flexGrow: 0, display: { xs: "none", sm: "flex" } }}>
            <Tooltip title="Conversations">
              <IconButton
                onClick={handleOpenChat}
                sx={{ p: 0, marginLeft: "2rem" }}
              >
                <Badge color="error" badgeContent={0} max={9}>
                  <Avatar sx={{ backgroundColor: "white" }}>
                    <ChatIcon color="primary" />
                  </Avatar>
                </Badge>
              </IconButton>
            </Tooltip>
            <Tooltip title="Notifications">
              <IconButton
                onClick={handleOpenNotification}
                sx={{ p: 0, marginLeft: "2rem" }}
              >
                <Badge color="error" badgeContent={unread} max={9}>
                  <Avatar sx={{ backgroundColor: "white" }}>
                    <NotificationsIcon color="primary" />
                  </Avatar>
                </Badge>
              </IconButton>
            </Tooltip>
            <Tooltip title="Settings">
              <IconButton
                onClick={handleOpenUserMenu}
                sx={{ p: 0, marginLeft: "2rem" }}
              >
                <Avatar
                  sx={{ bgcolor: "gray" }}
                  alt={user?.firstName}
                  src={user?.profilePicture}
                />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              disableScrollLock={true}
            >
              <MenuItem
                onClick={() => navigate(`/profile/${user?.username}`)}
                sx={{ marginBottom: "0.3rem" }}
              >
                <AccountCircleIcon sx={{ marginRight: "0.75rem" }} />
                <Typography textAlign="center">Profile</Typography>
              </MenuItem>
              <MenuItem
                onClick={() => navigate("/profile/details/edit")}
                sx={{ marginBottom: "0.3rem" }}
              >
                <EditIcon sx={{ marginRight: "0.75rem" }} />
                <Typography textAlign="center">Edit Profile</Typography>
              </MenuItem>
              <MenuItem
                onClick={() => navigate("/about")}
                sx={{ marginBottom: "0.3rem" }}
              >
                <InfoIcon sx={{ marginRight: "0.75rem" }} />
                <Typography textAlign="center">About Us</Typography>
              </MenuItem>
              <MenuItem sx={{ marginBottom: "0.3rem" }}>
                <DarkModeIcon sx={{ marginRight: "0.75rem" }} />
                <Typography textAlign="center">Dark Mode</Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout} sx={{ marginBottom: "0.3rem" }}>
                <LogoutIcon sx={{ marginRight: "0.75rem" }} />
                <Typography textAlign="center">Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
          <Box sx={{ display: { xs: "flex", sm: "none" } }}>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <NotificationPanel
        handleNotificationClose={handleCloseNotification}
        anchorEl={notificationAnchorEl}
      />
      <ChatPanel handleChatClose={handleCloseChat} anchorEl={chatAnchorEl} />
    </Box>
  )
}

export default Navbar
