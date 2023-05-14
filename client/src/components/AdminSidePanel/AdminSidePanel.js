import React, { useState } from "react"
import AppBar from "@mui/material/AppBar"
import Box from "@mui/material/Box"
import Divider from "@mui/material/Divider"
import Drawer from "@mui/material/Drawer"
import IconButton from "@mui/material/IconButton"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import MenuIcon from "@mui/icons-material/Menu"
import Toolbar from "@mui/material/Toolbar"
import Typography from "@mui/material/Typography"
import DashboardIcon from "@mui/icons-material/Dashboard"
import AccountBoxIcon from "@mui/icons-material/AccountBox"
import EventNoteIcon from "@mui/icons-material/EventNote"
import VerifiedIcon from "@mui/icons-material/Verified"
import LogoutIcon from "@mui/icons-material/Logout"
import PaymentsIcon from "@mui/icons-material/Payments"
import { useNavigate } from "react-router-dom"
import MUISwitch from "../ui/MUISwitch"
import { useDispatch } from "react-redux"
import { ADMIN_TOKEN_KEY } from "../../constants/constant"
import { clearAdminAuth } from "../../features/adminAuth/adminAuthSlice"

function AdminSidePanel({ drawerWidth }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY)
    dispatch(clearAdminAuth())
    navigate("/admin")
  }

  const drawer = (
    <div>
      <Toolbar />
      <List>
        <Divider />
        <ListItem disablePadding onClick={() => navigate("/admin/dashboard")}>
          <ListItemButton>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary={"Dashboard"} />
          </ListItemButton>
        </ListItem>
        <Divider />
        <ListItem disablePadding onClick={() => navigate("/admin/users")}>
          <ListItemButton>
            <ListItemIcon>
              <AccountBoxIcon />
            </ListItemIcon>
            <ListItemText primary={"Users"} />
          </ListItemButton>
        </ListItem>
        <Divider />
        <ListItem disablePadding onClick={() => navigate("/admin/posts")}>
          <ListItemButton>
            <ListItemIcon>
              <EventNoteIcon />
            </ListItemIcon>
            <ListItemText primary={"Posts"} />
          </ListItemButton>
        </ListItem>
        <Divider />
        <ListItem disablePadding onClick={() => navigate("/admin/elite")}>
          <ListItemButton>
            <ListItemIcon>
              <VerifiedIcon />
            </ListItemIcon>
            <ListItemText primary={"Elite"} />
          </ListItemButton>
        </ListItem>
        <Divider />
        <ListItem disablePadding onClick={() => navigate("/admin/payments")}>
          <ListItemButton>
            <ListItemIcon>
              <PaymentsIcon />
            </ListItemIcon>
            <ListItemText primary={"Payments"} />
          </ListItemButton>
        </ListItem>
        <Divider />
        <ListItem disablePadding onClick={handleLogout}>
          <ListItemButton>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary={"Logout"} />
          </ListItemButton>
        </ListItem>
        <Divider />
      </List>
    </div>
  )

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Typography variant="h6" noWrap component="div">
              Admin
            </Typography>
            <MUISwitch />
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </>
  )
}

export default AdminSidePanel
