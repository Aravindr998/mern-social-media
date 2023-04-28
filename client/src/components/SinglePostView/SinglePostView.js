import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Link,
  TextField,
  Typography,
} from "@mui/material"
import axios from "../../axios"
import React, { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder"
import FavoriteIcon from "@mui/icons-material/Favorite"
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline"
import ShareIcon from "@mui/icons-material/Share"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import {
  addComment,
  fetchComments,
  fetchMoreComments,
} from "../../features/comments/commentSlice"
import ShareOptions from "../ShareOptions/ShareOptions"
import { socket } from "../../socket"

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
  const [page, setPage] = useState(1)
  const [error, setError] = useState("")
  const [comment, setComment] = useState("")
  const [anchorEl, setAnchorEl] = useState(null)
  const commentRef = useRef()
  const formatter = new Intl.DateTimeFormat("en-GB", { dateStyle: "full" })
  useEffect(() => {
    ;(async () => {
      try {
        const { data } = await axios.get(`/api/post/${postId}/details`, {
          headers: { Authorization: auth },
        })
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
      socket.emit("postInteracted", data.notification)
    } catch (error) {
      console.log(error)
    }
  }
  let allComments
  if (comments.comments?.length > 0 && !comments?.loading) {
    console.log(comments)
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
              key={item?._id}
              sx={{
                display: "flex",
                alignItems: "center",
                marginBottom: "1rem",
                marginTop: "0.3rem",
              }}
            >
              <Avatar src={item?.userId?.profilePicture} />
              <Box>
                <Typography sx={{ marginLeft: "1rem", fontWeight: "700" }}>
                  {item?.userId?.username}
                </Typography>
                <Typography sx={{ marginLeft: "1rem" }}>
                  {item?.text}
                </Typography>
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
  const handleSharePost = async (e) => {
    setAnchorEl(e.currentTarget)
  }
  const handleShareClose = () => {
    setAnchorEl(null)
  }
  const handleComment = async () => {
    setError("")
    try {
      const { data } = await axios.patch(
        "/api/post/comment",
        { comment, postId },
        { headers: { Authorization: auth } }
      )
      setComment("")
      dispatch(addComment(data.comment))
      setCommentCount((prevState) => ++prevState)
      socket.emit("postInteracted", data.notification)
    } catch (error) {
      const { response } = error
      if (response) {
        if (response.status === 400) {
          setError(response.data.comment)
        }
      } else {
        console.log(error)
      }
    }
  }
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
        <Box
          component="img"
          src={post.media}
          sx={{ objectFit: "contain", maxHeight: "100%", maxWidth: "100%" }}
        />
      </Box>
      <Box
        sx={{
          width: "30%",
          height: "calc(100vh - 5rem)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", padding: "1rem" }}>
          <Avatar
            src={post.createdBy?.profilePicture}
            sx={{ marginRight: "1rem" }}
          />
          <Box>
            <Typography fontWeight={500}>{post.createdBy?.username}</Typography>
            {post.createdAt && (
              <Typography fontSize="0.9rem">
                {formatter.format(new Date(post.createdAt))}
              </Typography>
            )}
          </Box>
        </Box>
        <Box sx={{ padding: "1rem" }}>
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
        <Divider />
        <Box sx={{ padding: "0.5rem", cursor: "pointer" }}>
          {comments?.comments?.length <= commentCount && (
            <Link
              onClick={() => {
                dispatch(fetchMoreComments({ postId, page }))
                setPage((prevState) => ++prevState)
              }}
            >
              Load more comments
            </Link>
          )}
        </Box>
        <Box sx={{ height: "50%" }}>
          <Box
            sx={{ height: "100%", overflowY: "auto", paddingInline: "1rem" }}
          >
            {allComments}
          </Box>
        </Box>
        <Box
          sx={{ display: "flex", paddingInline: "1rem", alignItems: "center" }}
        >
          <TextField
            fullWidth
            sx={{ margin: "0.5rem" }}
            label="Add Comment"
            variant="filled"
            value={comment}
            onChange={(e) => {
              setComment(e.target.value)
              setError("")
            }}
            error={!!error}
            helperText={error}
          />
          <Button
            variant="contained"
            sx={{ padding: "1rem" }}
            onClick={handleComment}
          >
            Send
          </Button>
        </Box>
      </Box>
      <ShareOptions
        handleShareClose={handleShareClose}
        anchorEl={anchorEl}
        postId={postId}
        shared={false}
      />
    </Box>
  )
}

export default SinglePostView
