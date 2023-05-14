import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchSavedPosts } from "../../features/posts/postSlice"
import PostFeed from "../PostFeed/PostFeed"
import { Typography } from "@mui/material"

const SavedPosts = () => {
  const dispatch = useDispatch()
  const posts = useSelector((state) => state.posts)
  const user = useSelector((state) => state.user)
  useEffect(() => {
    dispatch(fetchSavedPosts())
  }, [])
  console.log(posts)
  let savedPosts = (
    <PostFeed
      loading={posts.loading}
      description={true}
      media={true}
    ></PostFeed>
  )
  if (!posts?.loading && !posts?.posts?.length) {
    savedPosts = <Typography>No Posts Saved</Typography>
  }
  if (!posts?.loading && posts?.posts?.length) {
    savedPosts = posts.posts.map((post) => {
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
          saved={true}
        />
      )
    })
  }
  if (posts.error) {
    savedPosts = (
      <Typography>Something went wrong, please try again later</Typography>
    )
  }
  return <>{savedPosts}</>
}

export default SavedPosts
