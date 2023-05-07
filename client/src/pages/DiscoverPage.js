import React from "react"
import SidePanel from "../components/SidePanel/SidePanel"
import { CssBaseline } from "@mui/material"
import ActivePanel from "../components/ActivePanel/ActivePanel"
import Discover from "../components/Discover/Discover"
import Navbar from "../components/Navbar/Navbar"
import InfiniteScroll from "react-infinite-scroller"

const DiscoverPage = () => {
  return (
    <>
      <CssBaseline />
      <Navbar />
      <SidePanel />
      <ActivePanel />
      <InfiniteScroll></InfiniteScroll>
      <Discover />
    </>
  )
}

export default DiscoverPage
