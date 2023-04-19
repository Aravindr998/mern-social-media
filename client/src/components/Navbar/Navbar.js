import React, { useEffect, useState } from "react"
import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import IconButton from "@mui/material/IconButton"
import {
  Avatar,
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

const settings = ["Profile", "Edit Profile", "About Us", "Dark Mode", "Logout"]
function Navbar() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const auth = useSelector((state) => state.auth)
  const user = useSelector((state) => state.user)
  const [search, setSearch] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState([])
  const handleLogout = (e) => {
    if (e.target.innerHTML === "Logout") {
      localStorage.removeItem(TOKEN_KEY)
      dispatch(clearAuth())
      navigate("/login")
    }
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
              console.log("entered")
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
                onClick={handleOpenUserMenu}
                sx={{ p: 0, marginLeft: "2rem" }}
              >
                <Avatar sx={{ backgroundColor: "white" }}>
                  <ChatIcon color="primary" />
                </Avatar>
              </IconButton>
            </Tooltip>
            <Tooltip title="Notifications">
              <IconButton
                onClick={handleOpenUserMenu}
                sx={{ p: 0, marginLeft: "2rem" }}
              >
                <Avatar sx={{ backgroundColor: "white" }}>
                  <NotificationsIcon color="primary" />
                </Avatar>
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
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center" onClick={handleLogout}>
                    {setting}
                  </Typography>
                </MenuItem>
              ))}
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
    </Box>
  )
}

export default Navbar
