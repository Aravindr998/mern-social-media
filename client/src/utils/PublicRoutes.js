import React from "react"
import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"

function PublicRoutes() {
  const auth = useSelector((state) => state.auth)
  return auth ? <Navigate to="/" /> : <Outlet />
}

export default PublicRoutes
