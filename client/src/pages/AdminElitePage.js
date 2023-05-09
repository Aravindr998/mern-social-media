import { Box, CssBaseline } from "@mui/material"
import React from "react"
import AdminSidePanel from "../components/AdminSidePanel/AdminSidePanel"
import AdminElite from "../components/AdminElite/AdminElite"

const AdminElitePage = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AdminSidePanel drawerWidth={240} />
      <AdminElite drawerWidth={240} />
    </Box>
  )
}

export default AdminElitePage
