import React, { useEffect } from "react"
import SinglePostView from "../components/SinglePostView/SinglePostView"
import Navbar from "../components/Navbar/Navbar"

const SinglePostPage = () => {
  useEffect(() => {
    document.title = "Vibee | Post"
  }, [])
  return (
    <>
      <Navbar />
      <SinglePostView />
    </>
  )
}

export default SinglePostPage
