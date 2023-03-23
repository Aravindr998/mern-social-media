import * as React from "react"
import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import IconButton from "@mui/material/IconButton"
import { Avatar, Menu, MenuItem, TextField, Tooltip } from "@mui/material"
import ChatIcon from "@mui/icons-material/Chat"
import NotificationsIcon from "@mui/icons-material/Notifications"
import MenuIcon from "@mui/icons-material/Menu"

const settings = ["Profile", "Edit Profile", "About Us", "Dark Mode", "Logout"]
function Navbar() {
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
      <AppBar position="fixed">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <Box>
            <Typography
              variant="h6"
              component="div"
              sx={{
                flexGrow: 1,
                fontSize: "1.8rem",
                fontFamily: "Autumn in November",
              }}
            >
              vibee
            </Typography>
          </Box>
          <Box>
            <TextField
              margin="normal"
              fullWidth
              name="search"
              label="Search"
              type="search"
              id="search"
              autoComplete="search"
              variant="outlined"
              sx={{
                backgroundColor: "white",
                borderRadius: "2rem",
                width: { xs: "100%", lg: "30rem" },
                display: { xs: "none", sm: "flex" },
              }}
            />
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
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
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
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
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
