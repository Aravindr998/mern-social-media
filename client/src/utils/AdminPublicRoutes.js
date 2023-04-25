import React from "react"
import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"

const AdminPublicRoutes = () => {
  const auth = useSelector((state) => state.adminAuth)
  return auth ? <Navigate to="/admin/dashboard" /> : <Outlet />
}

export default AdminPublicRoutes
