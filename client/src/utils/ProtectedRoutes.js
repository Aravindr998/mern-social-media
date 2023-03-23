import React from "react"
import { useSelector } from "react-redux"
import { Outlet, Navigate } from "react-router-dom"

function ProtectedRoutes() {
  const auth = useSelector((state) => state.auth)
  return auth ? <Outlet /> : <Navigate to="/login" />
}

export default ProtectedRoutes
