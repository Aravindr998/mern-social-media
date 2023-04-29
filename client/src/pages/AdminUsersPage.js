import { Box, CssBaseline } from "@mui/material"
import React, { useEffect, useState } from "react"
import AdminSidePanel from "../components/AdminSidePanel/AdminSidePanel"
import AdminUserList from "../components/AdminUserList/AdminUserList"
import AdminUserDetails from "../components/AdminUserDetails/AdminUserDetails"
import { useParams } from "react-router-dom"

const AdminUsersPage = () => {
  const [changePage, setChangePage] = useState(false)
  const { userId } = useParams()
  useEffect(() => {
    if (userId) {
      setChangePage(true)
    } else {
      setChangePage(false)
    }
  }, [userId])
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AdminSidePanel drawerWidth={240} />
      {changePage ? (
        <AdminUserDetails drawerWidth={240} />
      ) : (
        <AdminUserList drawerWidth={240} />
      )}
    </Box>
  )
}

export default AdminUsersPage
