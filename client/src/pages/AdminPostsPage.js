import { Box, CssBaseline } from "@mui/material"
import React, { useEffect } from "react"
import AdminPosts from "../components/AdminPosts/AdminPosts"
import AdminSidePanel from "../components/AdminSidePanel/AdminSidePanel"

const AdminPostsPage = () => {
  useEffect(() => {
    document.title = "Admin | Post Details"
  }, [])
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AdminSidePanel drawerWidth={240} />
      <AdminPosts drawerWidth={240} />
    </Box>
  )
}

export default AdminPostsPage
