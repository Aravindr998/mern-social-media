import React, { useEffect, useRef, useState } from "react"
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
  Grow,
  Menu,
  MenuItem,
  TextField,
  Tooltip,
  useMediaQuery,
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
import LogoutIcon from "@mui/icons-material/Logout"
import NotificationPanel from "../NotificationPanel/NotificationPanel"
import ExploreIcon from "@mui/icons-material/Explore"
import VerifiedIcon from "@mui/icons-material/Verified"
import ChatPanel from "../ChatPanel/ChatPanel"
import {
  changeReadState,
  fetchNotifications,
} from "../../features/notifications/notificationSlice"
import { changeMode } from "../../features/appearance/appearanceSlice"
import { useTheme } from "@emotion/react"
import DarkModeIcon from "@mui/icons-material/DarkMode"

function Navbar() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const auth = useSelector((state) => state.auth)
  const user = useSelector((state) => state.user)
  const notifications = useSelector((state) => state.notifications)
  const appearance = useSelector((state) => state.appearance)
  const matches = useMediaQuery("(min-width: 600px)")

  const [search, setSearch] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState([])
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null)
  const [chatAnchorEl, setChatAnchorEl] = useState(null)
  const [unread, setUnread] = useState(0)
  const [checked, setChecked] = useState(false)
  const [height, setHeight] = useState("0rem")
  const [padding, setPadding] = useState("0rem")
  const [count, setCount] = useState(0)
  const [show, setShow] = useState(false)
  const [key, setKey] = useState("")
  const searchRef = useRef()
  const theme = useTheme()
  const backgroundColor = theme.palette.mode === "dark" ? "#4e4f4f" : "#DFDFDF"

  useEffect(() => {
    dispatch(fetchNotifications())
  }, [])
  useEffect(() => {
    if (notifications.readByCount !== undefined) {
      setUnread(notifications.readByCount)
    }
  }, [notifications.readByCount])

  useEffect(() => {
    if (matches) {
      setHeight("0rem")
      setChecked(false)
      setPadding("0rem")
    }
    setSearch(false)
  }, [matches])

  useEffect(() => {
    if (count > result.length) {
      setShow(true)
    } else {
      setShow(false)
    }
  }, [])

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
                backgroundColor: backgroundColor,
              },
              borderRadius: "0.5rem",
              cursor: "pointer",
            }}
            // variant="plain"
            // fullWidth
            onClick={() => {
              navigate(`/profile/${user.username}`)
              setSearch(false)
              searchRef.current.value = ""
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
    setKey(e.target.value)
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
          setCount(data.count)
        })
        .catch((error) => console.log(error))
    }
  }

  const [anchorElUser, setAnchorElUser] = useState(null)

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  const handleChangeMode = () => {
    if (appearance === "light") localStorage.setItem("preferredMode", "dark")
    else localStorage.setItem("preferredMode", "light")
    dispatch(changeMode())
  }

  const handleOpenMenu = () => {
    if (height === "0rem") {
      setPadding("1rem")
      setHeight("23rem")
    } else {
      setTimeout(() => {
        setPadding("0rem")
      }, 100)
      setHeight("0rem")
    }
    setChecked((prevState) => !prevState)
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
          <Box sx={{ position: "relative", width: "35%" }}>
            {/* <TextField
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
            /> */}
            <Box
              component={"input"}
              onChange={handleSearch}
              placeholder="Search"
              sx={{
                padding: "1rem",
                borderRadius: "2rem",
                width: "100%",
                border: "none",
                "&:focus": {
                  outline: "none",
                },
                display: { xs: "none", sm: "flex" },
              }}
              ref={searchRef}
              value={key}
            />
            {search && (
              <>
                <Card
                  sx={{
                    position: "absolute",
                    left: { xs: -185, sm: 0 },
                    right: { xs: -165, sm: 0 },
                    top: { xs: 95, sm: 50 },
                    zIndex: 10,
                  }}
                >
                  <CardContent>
                    {loading ? (
                      <Button loading="true" variant="plain">
                        Loading
                      </Button>
                    ) : (
                      searchResult
                    )}
                    {!show && (
                      <>
                        <Box display={"flex"} justifyContent={"center"}>
                          <Button
                            onClick={() => {
                              navigate(`/search?key=${key}`)
                            }}
                          >
                            Show More
                          </Button>
                        </Box>
                      </>
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
              <MenuItem
                sx={{ marginBottom: "0.3rem" }}
                onClick={handleChangeMode}
              >
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
              onClick={handleOpenMenu}
            >
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
        <Grow
          in={checked}
          style={{ transformOrigin: "0 0 0" }}
          {...(checked ? { timeout: 1000 } : {})}
        >
          <Box>
            <Box
              width={"100%"}
              padding={padding}
              sx={{ height, transition: "height 0.3s" }}
            >
              <TextField
                fullWidth
                variant="standard"
                placeholder="Search"
                sx={{ paddingBlock: "1rem" }}
                onChange={handleSearch}
                ref={searchRef}
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  gap: "1rem",
                  justifyContent: "center",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate("/conversations")}
                >
                  <IconButton sx={{ p: 0 }}>
                    <Badge color="error" badgeContent={0} max={9}>
                      <Avatar sx={{ backgroundColor: "white" }}>
                        <ChatIcon color="primary" />
                      </Avatar>
                    </Badge>
                  </IconButton>
                  <Typography fontWeight={500}>Conversations</Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate("/notifications")}
                >
                  <IconButton sx={{ p: 0 }}>
                    <Badge color="error" badgeContent={unread} max={9}>
                      <Avatar sx={{ backgroundColor: "white" }}>
                        <NotificationsIcon color="primary" />
                      </Avatar>
                    </Badge>
                  </IconButton>
                  <Typography fontWeight={500}>Notifications</Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate("/discover")}
                >
                  <IconButton sx={{ p: 0 }}>
                    <Avatar sx={{ backgroundColor: "white" }}>
                      <ExploreIcon color="primary" />
                    </Avatar>
                  </IconButton>
                  <Typography fontWeight={500}>Discover</Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    cursor: "pointer",
                  }}
                  onClick={() => navigate("/elite/plan")}
                >
                  <IconButton sx={{ p: 0 }}>
                    <Avatar sx={{ backgroundColor: "white" }}>
                      <VerifiedIcon color="primary" />
                    </Avatar>
                  </IconButton>
                  <Typography fontWeight={500}>Vibee Elite</Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                    cursor: "pointer",
                  }}
                >
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      sx={{ bgcolor: "gray" }}
                      alt={user?.firstName}
                      src={user?.profilePicture}
                    />
                  </IconButton>
                  <Typography fontWeight={500}>Profile</Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </Grow>
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
