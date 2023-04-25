import React from "react"
import AdminSidePanel from "../components/AdminSidePanel/AdminSidePanel"
import AdminDashboard from "../components/AdminDashboard/AdminDashboard"
import { Box, CssBaseline } from "@mui/material"

const AdminDashboardPage = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <AdminSidePanel drawerWidth={240} />
      <AdminDashboard drawerWidth={240} />
    </Box>
  )
}

export default AdminDashboardPage
