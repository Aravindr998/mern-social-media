import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  Link,
  Menu,
  MenuItem,
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
import {
  addComment,
  deleteComment,
  fetchComments,
  fetchMoreComments,
} from "../../features/comments/commentSlice"
import ShareOptions from "../ShareOptions/ShareOptions"
import { socket } from "../../socket"
import PostMenu from "../PostMenu/PostMenu"
import SinglePostMenu from "../SinglePostMenu/SinglePostMenu"

const SinglePostView = () => {
  const { postId } = useParams()
  const navigate = useNavigate()
  const auth = useSelector((state) => state.auth)
  const user = useSelector((state) => state.user)
  const comments = useSelector((state) => state.comments)
  const appearance = useSelector((state) => state.appearance)
  const dispatch = useDispatch()

  const [post, setPost] = useState({})
  const [liked, setLiked] = useState(false)
  const [likedCount, setLikedCount] = useState(0)
  const [commentCount, setCommentCount] = useState(0)
  const [page, setPage] = useState(1)
  const [error, setError] = useState("")
  const [comment, setComment] = useState("")
  const [anchorEl, setAnchorEl] = useState(null)
  const [anchorElPostMenu, setAnchorElPostMenu] = useState(null)
  const [anchorElComments, setAnchorElComments] = useState(null)
  const [show, setShow] = useState(false)
  const [openConfirmation, setOpenConfirmation] = useState(false)
  const [commentId, setCommentId] = useState("")
  const [openMenu, setOpenMenu] = useState(false)

  const openCommentMenu = Boolean(anchorElComments)
  // const openMenu = Boolean(anchorElPostMenu)
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
  }, [postId])

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

  //post handlers
  const handleClick = (event) => {
    setAnchorElPostMenu(event.currentTarget)
  }
  const handleClose = () => {
    //here
    setAnchorElPostMenu(null)
  }

  //comment handlers
  const handleCommentClick = (event, id) => {
    setAnchorElComments(event.currentTarget)
    setCommentId(id)
  }
  const handleCommentClose = () => {
    setAnchorElComments(null)
    setCommentId("")
  }
  const handleCommentDelete = () => {
    setOpenConfirmation(true)
  }
  const handleCloseDelConfirmation = () => {
    setOpenConfirmation(false)
  }

  const handleDelete = () => {
    setShow(true)
  }
  const handleDeleteComment = async () => {
    try {
      const { data } = await axios.patch(
        `/api/post/${postId}/comments/delete`,
        { commentId },
        { headers: { Authorization: auth } }
      )
      dispatch(deleteComment(data))
      setOpenConfirmation(false)
      setAnchorElComments(null)
    } catch (error) {
      console.log(error)
    }
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

  //share post handler
  const handleSharePost = async (e) => {
    setAnchorEl(e.currentTarget)
  }
  const handleShareClose = () => {
    setAnchorEl(null)
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
                <Typography
                  sx={{ marginLeft: "1rem", fontWeight: "700" }}
                  color={appearance === "light" ? "black" : "white"}
                >
                  {item?.userId?.username}
                </Typography>
                <Typography
                  sx={{ marginLeft: "1rem" }}
                  color={appearance === "light" ? "black" : "white"}
                >
                  {item?.text}
                </Typography>
              </Box>
            </Box>
            <IconButton
              aria-label="settings"
              onClick={(e) => handleCommentClick(e, item?._id)}
            >
              <MoreVertIcon fontSize="small" />
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

  //report post handlers
  const handleReport = async () => {
    try {
      const { data } = await axios.patch(
        `/api/post/${postId}/report`,
        {},
        { headers: { Authorization: auth } }
      )
      setAnchorElPostMenu(null)
      //show snackbar
    } catch (error) {
      console.log(error)
    }
  }

  //post menu handlers
  const handleClickAway = (e) => {
    setOpenMenu(false)
  }
  const handleEdit = (post) => {
    setPost(post)
  }

  return (
    <Box
      sx={{
        marginTop: { xs: "3rem", sm: "4rem" },
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
      }}
    >
      <Box
        sx={{
          width: { xs: "100%", sm: "70%" },
          height: "calc(100vh - 4rem)",
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
          width: { xs: "100%", sm: "30%" },
          height: "calc(100vh - 4rem)",
          bgcolor: (theme) => theme.palette.background.paper,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", padding: "1rem" }}>
            <Avatar
              src={post.createdBy?.profilePicture}
              sx={{ marginRight: "1rem" }}
            />
            <Box>
              <Typography
                fontWeight={500}
                color={appearance === "light" ? "black" : "white"}
              >
                {post.createdBy?.username}
              </Typography>
              {post.createdAt && (
                <Typography
                  fontSize="0.9rem"
                  color={appearance === "light" ? "black" : "white"}
                >
                  {formatter.format(new Date(post.createdAt))}
                </Typography>
              )}
            </Box>
          </Box>
          <IconButton
            //  onClick={handleClick}
            onClick={() => {
              setOpenMenu((prevState) => !prevState)
            }}
          >
            <MoreVertIcon />
          </IconButton>
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
          {comments?.comments?.length < commentCount && (
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
        <Box sx={{ height: "60%" }}>
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
      {/* <Menu
        id="basic-menu"
        anchorEl={anchorElPostMenu}
        open={openMenu}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        {user?._id === post?.createdBy?._id ? (
          <>
            <MenuItem>Edit Post</MenuItem>
            <MenuItem onClick={handleDelete}>Delete Post</MenuItem>
          </>
        ) : (
          <MenuItem onClick={handleReport}>Report Post</MenuItem>
        )}
      </Menu> */}
      <SinglePostMenu
        handleClickAway={handleClickAway}
        checked={openMenu}
        postOwner={post?.createdBy?._id}
        postId={postId}
        handleEdit={handleEdit}
      />
      <Menu
        id="basic-menu"
        anchorEl={anchorElComments}
        open={openCommentMenu}
        onClose={handleCommentClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleCommentDelete}>Delete Comment</MenuItem>
      </Menu>
      <Dialog
        open={openConfirmation}
        onClose={handleCloseDelConfirmation}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Are you sure?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this comment? Deleted comments
            cannot be recovered.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelConfirmation}>Cancel</Button>
          <Button onClick={handleDeleteComment} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default SinglePostView
