import { Box, CssBaseline } from "@mui/material"
import React from "react"
import AdminPosts from "../components/AdminPosts/AdminPosts"
import AdminSidePanel from "../components/AdminSidePanel/AdminSidePanel"

const AdminPostsPage = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AdminSidePanel drawerWidth={240} />
      <AdminPosts drawerWidth={240} />
    </Box>
  )
}

export default AdminPostsPage
