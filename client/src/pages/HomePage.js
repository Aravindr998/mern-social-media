import React, { useEffect, useState } from "react"
import { CssBaseline, Typography } from "@mui/material"
import { Container } from "@mui/system"
import { useDispatch, useSelector } from "react-redux"
import ActivePanel from "../components/ActivePanel/ActivePanel"
import Create from "../components/Create/Create"
import Navbar from "../components/Navbar/Navbar"
import PostFeed from "../components/PostFeed/PostFeed"
import SidePanel from "../components/SidePanel/SidePanel"
import { fetchPosts, loadMorePosts } from "../features/posts/postSlice"
import InfiniteScroll from "react-infinite-scroller"

function HomePage() {
  useEffect(() => {
    document.title = "Vibee | Home"
  }, [])
  const [pageNumber, setPageNumber] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const posts = useSelector((state) => state.posts)
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchPosts())
  }, [])
  useEffect(() => {
    if (posts.total <= posts.posts.length) {
      setHasMore(false)
    } else {
      setHasMore(true)
    }
  }, [posts.posts])
  const loadHandler = () => {
    if (!posts.loading && pageNumber <= Math.ceil(posts.total / 10)) {
      dispatch(loadMorePosts(pageNumber))
      setPageNumber((prevState) => ++prevState)
    }
  }
  let postFeed
  if (posts.error) {
    postFeed = (
      <Typography>Something went wrong. Please Try again later</Typography>
    )
  } else if (posts?.posts?.length) {
    postFeed = posts.posts.map((post) => {
      return (
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
          liked={post.likes.includes(user?._id)}
          loading={posts.loading}
          privacy={post.privacy}
          sharedPost={post.postId}
        />
      )
    })
  } else {
    if (posts.loading) {
      postFeed = (
        <PostFeed loading={posts.loading} description={true} media={true} />
      )
    } else {
      postFeed = <Typography>No posts to show</Typography>
    }
  }
  return (
    <>
      <CssBaseline />
      <Navbar />
      <SidePanel />
      <ActivePanel />
      <InfiniteScroll
        pageStart={0}
        loadMore={loadHandler}
        hasMore={hasMore}
        loader={
          <Container
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              marginTop: 0,
              // paddingLeft: { xs: "2rem ", lg: "18rem !important" },
              // paddingRight: { xs: "2rem ", lg: "18rem !important" },
            }}
            key={1}
          >
            <PostFeed loading={true} description={true} media={true} />
          </Container>
        }
      >
        <Container
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 10,
            // paddingLeft: { xs: "2rem ", lg: "18rem !important" },
            // paddingRight: { xs: "2rem ", lg: "18rem !important" },
          }}
        >
          <Create />
          {postFeed}
        </Container>
      </InfiniteScroll>
    </>
  )
}

export default HomePage
