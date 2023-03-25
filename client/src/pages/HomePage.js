import { CssBaseline, Typography } from "@mui/material"
import { Container } from "@mui/system"
import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import ActivePanel from "../components/ActivePanel/ActivePanel"
import Create from "../components/Create/Create"
import Navbar from "../components/Navbar/Navbar"
import PostFeed from "../components/PostFeed/PostFeed"
import SidePanel from "../components/SidePanel/SidePanel"
import { fetchPosts } from "../features/posts/postSlice"

function HomePage() {
  const posts = useSelector((state) => state.posts)
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchPosts())
  }, [])
  console.log(posts)
  let postFeed
  if (posts.error) {
    postFeed = (
      <Typography>Something went wrong. Please Try again later</Typography>
    )
  } else if (posts?.posts?.posts?.length) {
    postFeed = posts.posts.posts.map((post) => (
      <PostFeed
        key={post._id}
        postId={post._id}
        createdBy={post.createdBy}
        createdAt={post.createdAt}
        description={post.description}
        media={post.media}
        likes={post.likes.length}
        location={post.location}
        shared={post.shared}
        comments={post.comments}
        liked={post.likes.includes(user._id)}
      />
    ))
  } else {
    postFeed = <Typography>No posts to show</Typography>
  }
  return (
    <>
      <CssBaseline />
      <Navbar />
      <SidePanel />
      <ActivePanel />
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 12.5,
          // paddingLeft: { xs: "2rem ", lg: "18rem !important" },
          // paddingRight: { xs: "2rem ", lg: "18rem !important" },
        }}
      >
        <Create />
        {postFeed}
      </Container>
    </>
  )
}

export default HomePage
