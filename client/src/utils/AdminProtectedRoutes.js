import React from "react"
import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"

const AdminProtectedRoutes = () => {
  const auth = useSelector((state) => state.adminAuth)
  return auth ? <Outlet /> : <Navigate to="/admin" />
}

export default AdminProtectedRoutes
