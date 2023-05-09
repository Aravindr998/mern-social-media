import { Box, CssBaseline } from "@mui/material"
import React from "react"
import AdminSidePanel from "../components/AdminSidePanel/AdminSidePanel"
import AdminPayments from "../components/AdminPayments/AdminPayments"

const AdminPaymentsPage = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AdminSidePanel drawerWidth={240} />
      <AdminPayments drawerWidth={240} />
    </Box>
  )
}

export default AdminPaymentsPage
