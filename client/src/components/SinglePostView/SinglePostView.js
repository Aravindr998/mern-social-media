import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  TextField,
  Typography,
} from "@mui/material"
import axios from "../../axios"
import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder"
import FavoriteIcon from "@mui/icons-material/Favorite"
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline"
import ShareIcon from "@mui/icons-material/Share"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import { fetchComments } from "../../features/comments/commentSlice"

const SinglePostView = () => {
  const { postId } = useParams()
  const navigate = useNavigate()
  const auth = useSelector((state) => state.auth)
  const user = useSelector((state) => state.user)
  const comments = useSelector((state) => state.comments)
  const dispatch = useDispatch()
  const [post, setPost] = useState({})
  const [liked, setLiked] = useState(false)
  const [likedCount, setLikedCount] = useState(0)
  const [commentCount, setCommentCount] = useState(0)
  const formatter = new Intl.DateTimeFormat("en-GB", { dateStyle: "full" })
  useEffect(() => {
    ;(async () => {
      try {
        const { data } = await axios.get(`/api/post/${postId}/details`, {
          headers: { Authorization: auth },
        })
        console.log(data)
        setPost(data)
        setLikedCount(data.likes.length)
        setCommentCount(data.comments.length)
        dispatch(fetchComments(postId))
      } catch (error) {
        const { response } = error
        if (response) {
          if (response.status === 404) {
            console.log("requested post does not exist")
            //redirect to page not found
          } else if (response.status === 301) {
            navigate(`/post/${response.data.id}`)
          } else {
            //redirect to content isn't availabe
          }
        } else {
          console.log(error)
        }
      }
    })()
  }, [])
  useEffect(() => {
    if (post?.likes?.includes(user?._id)) setLiked(true)
  }, [user, post])
  const handleLike = async () => {
    try {
      const { data } = await axios.patch(
        "/api/post/like",
        { postId },
        { headers: { Authorization: auth } }
      )
      setLiked((prevState) => !prevState)
      setLikedCount((prevState) => prevState + data.amount)
    } catch (error) {
      console.log(error)
    }
  }
  let allComments
  if (comments.comments?.length > 0 && !comments?.loading) {
    allComments = comments.comments.map((item) => {
      return (
        <>
          <Divider />
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box
              key={item._id}
              sx={{
                display: "flex",
                alignItems: "center",
                marginBottom: "1rem",
                marginTop: "0.3rem",
              }}
            >
              <Avatar src={item.userId?.profilePicture} />
              <Box>
                <Typography sx={{ marginLeft: "1rem", fontWeight: "700" }}>
                  {item.userId.username}
                </Typography>
                <Typography sx={{ marginLeft: "1rem" }}>{item.text}</Typography>
              </Box>
            </Box>
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          </Box>
        </>
      )
    })
  } else {
    allComments = (
      <Box sx={{ width: "100%", paddingBottom: "1rem" }}>
        <Typography sx={{ color: "gray" }}>No Comments To Show</Typography>
      </Box>
    )
  }
  const handleSharePost = async () => {}
  return (
    <Box sx={{ marginTop: "5rem", display: "flex" }}>
      <Box
        sx={{
          width: "70%",
          height: "calc(100vh - 5rem)",
          backgroundColor: "black",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box component="img" src={post.media} />
      </Box>
      <Box
        sx={{
          width: "30%",
          height: "calc(100vh - 5rem)",
        }}
      >
        <Box>
          <Avatar src={post.createdBy?.profilePicture} />
          <Box>
            <Typography>{post.createdBy?.username}</Typography>
            {post.createdAt && (
              <Typography>
                {formatter.format(new Date(post.createdAt))}
              </Typography>
            )}
          </Box>
        </Box>
        <Box>
          <Typography>{post.description}</Typography>
        </Box>
        <Divider />
        <Box sx={{ display: "flex", justifyContent: "space-around" }}>
          <IconButton
            aria-label="like"
            onClick={handleLike}
            sx={{ borderRadius: "0.5rem" }}
          >
            {!liked ? (
              <FavoriteBorderIcon color="primary" />
            ) : (
              <FavoriteIcon color="primary" />
            )}
            <Typography>{likedCount ? likedCount : "Like"}</Typography>
          </IconButton>
          <IconButton aria-label="comment" sx={{ borderRadius: "0.5rem" }}>
            <ChatBubbleOutlineIcon color="primary" />
            <Typography>{commentCount ? commentCount : "Comment"}</Typography>
          </IconButton>
          <IconButton
            aria-label="share"
            sx={{ borderRadius: "0.5rem" }}
            onClick={handleSharePost}
          >
            <ShareIcon color="primary" />
            <Typography>Share</Typography>
          </IconButton>
        </Box>
        <Box sx={{ height: "60%" }}>
          <Box sx={{ height: "100%", overflowY: "auto" }}>{allComments}</Box>
        </Box>
        <Box sx={{ display: "flex", padding: "1rem", alignItems: "center" }}>
          <TextField fullWidth sx={{ margin: "0.5rem" }} />
          <Button variant="contained" sx={{ padding: "1rem" }}>
            Send
          </Button>
        </Box>
      </Box>
    </Box>
  )
}

export default SinglePostView
