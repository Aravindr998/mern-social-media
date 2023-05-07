import React from "react"
import { Card, CardContent, Typography } from "@mui/material"
import ExploreIcon from "@mui/icons-material/Explore"
import HomeIcon from "@mui/icons-material/Home"
import ChatIcon from "@mui/icons-material/Chat"
import NotificationsIcon from "@mui/icons-material/Notifications"
import VerifiedIcon from "@mui/icons-material/Verified"
import { Box } from "@mui/system"
import { useNavigate } from "react-router-dom"
import { useTheme } from "@emotion/react"

function SidePanel() {
  const navigate = useNavigate()
  const theme = useTheme()
  return (
    <Card
      sx={{
        position: "fixed",
        top: 80,
        left: 20,
        width: "23%",
        height: "85vh",
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
        <Box
          sx={{ display: "flex", marginBottom: 5, cursor: "pointer" }}
          onClick={() => {
            navigate("/discover")
          }}
        >
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
        <Box
          sx={{ display: "flex", marginBottom: 5, cursor: "pointer" }}
          onClick={() => {
            navigate("/notifications")
          }}
        >
          <NotificationsIcon sx={{ marginRight: 1 }} />
          <Typography sx={{ fontWeight: 700 }}>Notifications</Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            marginBottom: 5,
            cursor: "pointer",
            "&:hover": { color: theme.palette.primary.main },
            transition: "color 0.3s",
          }}
          onClick={() => {
            navigate("/elite/plans")
          }}
        >
          <VerifiedIcon sx={{ marginRight: 1 }} />
          <Typography sx={{ fontWeight: 700 }}>Vibee Elite</Typography>
        </Box>
      </CardContent>
    </Card>
  )
}

export default SidePanel
