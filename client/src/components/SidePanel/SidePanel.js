import React from "react"
import { Card, CardContent, Typography } from "@mui/material"
import ExploreIcon from "@mui/icons-material/Explore"
import HomeIcon from "@mui/icons-material/Home"
import ChatIcon from "@mui/icons-material/Chat"
import NotificationsIcon from "@mui/icons-material/Notifications"
import { Box } from "@mui/system"
import { useNavigate } from "react-router-dom"

function SidePanel() {
  const navigate = useNavigate()
  return (
    <Card
      sx={{
        position: "fixed",
        top: 100,
        left: 20,
        width: "23%",
        height: "82vh",
        marginBottom: "2rem",
        padding: "2rem",
        display: { xs: "none", lg: "flex" },
      }}
    >
      <CardContent>
        <Box
          sx={{ display: "flex", marginBottom: 5, cursor: "pointer" }}
          onClick={() => {
            navigate("/")
          }}
        >
          <HomeIcon sx={{ marginRight: 1 }} />
          <Typography sx={{ fontWeight: 700 }}>Home</Typography>
        </Box>
        <Box sx={{ display: "flex", marginBottom: 5 }}>
          <ExploreIcon sx={{ marginRight: 1 }} />
          <Typography sx={{ fontWeight: 700 }}>Discover</Typography>
        </Box>
        <Box
          sx={{ display: "flex", marginBottom: 5, cursor: "pointer" }}
          onClick={() => {
            navigate("/conversations")
          }}
        >
          <ChatIcon sx={{ marginRight: 1 }} />
          <Typography sx={{ fontWeight: 700 }}>Conversations</Typography>
        </Box>
        <Box sx={{ display: "flex", marginBottom: 5 }}>
          <NotificationsIcon sx={{ marginRight: 1 }} />
          <Typography sx={{ fontWeight: 700 }}>Notifications</Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default SidePanel
