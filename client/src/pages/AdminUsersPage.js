import { Box, CssBaseline } from "@mui/material"
import React from "react"
import AdminSidePanel from "../components/AdminSidePanel/AdminSidePanel"
import AdminUserList from "../components/AdminUserList/AdminUserList"

const AdminUsersPage = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AdminSidePanel drawerWidth={240} />
      <AdminUserList drawerWidth={240} />
    </Box>
  )
}

export default AdminUsersPage
