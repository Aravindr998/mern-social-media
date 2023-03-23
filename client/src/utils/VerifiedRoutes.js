import React from "react"
import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"

function VerifiedRoutes() {
  const user = useSelector((state) => state.user)
  console.log(user)
  return user.username ? <Outlet /> : <Navigate to="/details/add" />
}

export default VerifiedRoutes
