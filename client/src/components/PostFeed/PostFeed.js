import React, { useEffect, useState } from "react"
import Card from "@mui/material/Card"
import CardHeader from "@mui/material/CardHeader"
import CardMedia from "@mui/material/CardMedia"
import CardContent from "@mui/material/CardContent"
import CardActions from "@mui/material/CardActions"
import Avatar from "@mui/material/Avatar"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import { deepPurple } from "@mui/material/colors"
import FavoriteIcon from "@mui/icons-material/Favorite"
import ShareIcon from "@mui/icons-material/Share"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder"
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline"
import axios from "../../axios"
import { useDispatch, useSelector } from "react-redux"
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grow,
  Link,
  Menu,
  MenuItem,
  Skeleton,
  TextField,
  Tooltip,
} from "@mui/material"
import { Box } from "@mui/system"
import SendIcon from "@mui/icons-material/Send"
import PostMenu from "../PostMenu/PostMenu"
import {
  addComment,
  deleteComment,
  fetchComments,
  fetchMoreComments,
} from "../../features/comments/commentSlice"
import { ClickAwayListener } from "@mui/material"
import ShareOptions from "../ShareOptions/ShareOptions"
import { useNavigate } from "react-router-dom"
import { socket } from "../../socket"
import BookmarkIcon from "@mui/icons-material/Bookmark"
import { deletePost } from "../../features/posts/postSlice"
import VerifiedIcon from "@mui/icons-material/Verified"

function PostFeed(props) {
  const navigate = useNavigate()
  const comments = useSelector((state) => state.comments)
  const user = useSelector((state) => state.user)
  const [liked, setLiked] = useState(false)
  const [postLoading, setPostLoading] = useState(true)
  const [likeCount, setLikeCount] = useState(0)
  const [open, setOpen] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [error, setError] = useState("")
  const [openMenu, setOpenMenu] = useState(false)
  const [commentNumber, setCommentNumber] = useState(0)
  const [page, setPage] = useState(1)
  const [anchorEl, setAnchorEl] = useState(null)
  const [anchorElComments, setAnchorElComments] = useState(null)
  const [openConfirmation, setOpenConfirmation] = useState(false)
  const [commentId, setCommentId] = useState("")
  const [setting, setSetting] = useState(false)

  const dispatch = useDispatch()
  const imageFormat = ["jpg", "jpeg", "png", "webp"]

  useEffect(() => {
    if (!props.loading) setPostLoading(false)
    setLikeCount(props.likes)
    if (props.liked) {
      setLiked(true)
    }
    if (props.comments) setCommentNumber(props.comments.length)
    if (props.saved) {
      setSetting(true)
    }
  }, [props])
  function getUrlExtension(url) {
    return url.split(/[#?]/)[0].split(".").pop().trim()
  }
  const handleCommentClick = (event, id) => {
    setAnchorElComments(event.currentTarget)
    setCommentId(id)
  }
  let extension
  if (typeof props.media === "string") {
    extension = getUrlExtension(props.media)
  } else if (typeof props?.sharedPost?.media === "string")
    extension = getUrlExtension(props.sharedPost.media)
  let isImage = imageFormat.includes(extension)
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
                <Typography sx={{ marginLeft: "1rem" }} fontSize={"0.9rem"}>
                  {item.text}
                </Typography>
              </Box>
            </Box>
            {(props?.createdBy?._id === user._id ||
              item.userId._id === user._id) && (
              <IconButton
                aria-label="settings"
                onClick={(e) => handleCommentClick(e, item._id)}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
            )}
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

  const auth = useSelector((state) => state.auth)
  const formatter = new Intl.DateTimeFormat("en-GB", { dateStyle: "full" })
  const handleLike = () => {
    axios
      .patch(
        "/api/post/like",
        { postId: props.postId },
        { headers: { Authorization: auth } }
      )
      .then(({ data }) => {
        setLiked((prevState) => !prevState)
        setLikeCount((prevState) => prevState + data.amount)
        socket.emit("postInteracted", data.notification)
      })
      .catch((error) => {
        console.log(error)
      })
  }
  const handleComment = () => {
    axios
      .patch(
        "/api/post/comment",
        { comment: commentText, postId: props.postId },
        { headers: { Authorization: auth } }
      )
      .then(({ data }) => {
        dispatch(addComment(data.comment))
        setCommentText("")
        setCommentNumber((prevState) => ++prevState)
        socket.emit("postInteracted", data.notification)
      })
      .catch(({ response }) => {
        if (response.status === 400) {
          setError(response.data.comment)
        }
      })
  }
  const handleClickAway = (e) => {
    setOpenMenu(false)
  }
  const commentOpenHandler = () => {
    if (!open) {
      dispatch(fetchComments(props?.postId))
    }
    setOpen((prevState) => !prevState)
  }
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleComment()
  }
  const loadMoreComments = () => {
    dispatch(fetchMoreComments({ postId: props.postId, page }))
    setPage((prevState) => ++prevState)
  }
  const handleSharePost = (e) => {
    setAnchorEl(e.currentTarget)
  }
  const handleShareClose = () => {
    setAnchorEl(null)
  }
  const openCommentMenu = Boolean(anchorElComments)

  const handleCommentClose = () => {
    setAnchorElComments(null)
  }
  const handleCommentDelete = () => {
    setOpenConfirmation(true)
  }
  const handleCloseDelConfirmation = () => {
    setOpenConfirmation(false)
  }
  const handleDeleteComment = async () => {
    try {
      const { data } = await axios.patch(
        `/api/post/${props?.postId}/comments/delete`,
        { commentId },
        { headers: { Authorization: auth } }
      )
      //Remove comment from redux state
      dispatch(deleteComment(data))
      setOpenConfirmation(false)
      setAnchorElComments(null)
    } catch (error) {
      console.log(error)
    }
  }

  const handleUnsave = async () => {
    try {
      const { data } = await axios.patch(
        "/api/post/unsave",
        { postId: props.postId },
        { headers: { Authorization: auth } }
      )
      dispatch(deletePost(data))
    } catch (error) {
      console.log(error)
    }
  }

  let settings = (
    <IconButton
      aria-label="settings"
      onClick={() => {
        setOpenMenu((prevState) => !prevState)
      }}
    >
      <MoreVertIcon />
    </IconButton>
  )

  if (setting) {
    settings = (
      <Tooltip title="Unsave">
        <Button onClick={handleUnsave}>
          <BookmarkIcon />
        </Button>
      </Tooltip>
    )
  }

  return (
    <>
      <ClickAwayListener onClickAway={() => setOpen(false)}>
        <Card
          sx={{
            width: { xs: "90%", lg: "50%" },
            marginBottom: "1rem",
            position: "relative",
          }}
        >
          <CardHeader
            avatar={
              postLoading ? (
                <Skeleton
                  animation="wave"
                  variant="circular"
                  width={40}
                  height={40}
                />
              ) : (
                <Avatar
                  sx={{ bgcolor: deepPurple[900] }}
                  aria-label="profile-picture"
                  src={props?.createdBy?.profilePicture}
                >
                  {props?.createdBy?.firstName?.charAt(0)}
                </Avatar>
              )
            }
            action={postLoading ? null : <> {settings}</>}
            title={
              postLoading ? (
                <Skeleton
                  animation="wave"
                  height={10}
                  width="50%"
                  style={{ marginBottom: 6 }}
                />
              ) : (
                <Box
                  display={"flex"}
                  sx={{ cursor: "pointer" }}
                  onClick={() =>
                    navigate(`/profile/${props?.createdBy?.username}`)
                  }
                >
                  <Typography fontWeight={500}>
                    {props?.createdBy?.username}
                  </Typography>
                  {props?.createdBy?.elite && (
                    <Tooltip title="Verified">
                      <Typography marginLeft={"0.3rem"}>
                        {<VerifiedIcon fontSize="small" color="primary" />}
                      </Typography>
                    </Tooltip>
                  )}
                </Box>
              )
            }
            subheader={
              postLoading ? (
                <Skeleton animation="wave" height={10} width="40%" />
              ) : (
                formatter.format(new Date(props?.createdAt))
              )
            }
          />
          {props.description && (
            <CardContent>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  paddingLeft: "1rem",
                  paddingRight: "1rem",
                }}
                fontSize={"1rem"}
              >
                {postLoading ? <Skeleton /> : props?.description}
              </Typography>
            </CardContent>
          )}
          {props?.media &&
            (postLoading ? (
              <Skeleton
                height={290}
                width="100%"
                animation="wave"
                variant="rectangular"
                // sx={{ mx: "auto", borderRadius: "1rem" }}
              />
            ) : (
              <CardMedia
                component={isImage ? "img" : "video"}
                height="400"
                src={props?.media}
                alt="post image"
                sx={{ cursor: "pointer" }}
                type={!isImage ? "video/mp4" : undefined}
                onClick={() => navigate(`/post/${props?.postId}`)}
                controls={!isImage}
                // sx={{ padding: "2rem", borderRadius: "3rem" }}
              />
            ))}
          {props?.shared &&
            props?.sharedPost?._id &&
            (postLoading ? (
              <Skeleton
                height={290}
                width="100%"
                animation="wave"
                variant="rectangular"
                // sx={{ mx: "auto", borderRadius: "1rem" }}
              />
            ) : (
              <Box
                sx={{
                  padding: "1rem",
                  border: "solid 1px #DFDFDF",
                  margin: "1rem",
                  borderRadius: "1rem",
                  cursor: "pointer",
                }}
                onClick={() => navigate(`/post/${props?.sharedPost?._id}`)}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "1rem",
                  }}
                >
                  <Avatar src={props?.sharedPost?.createdBy?.profilePicture} />
                  <Box sx={{ marginLeft: "0.5rem" }}>
                    <Typography fontSize="0.9rem" fontWeight={500}>
                      {props?.sharedPost?.createdBy?.username}
                    </Typography>
                    <Typography fontSize="0.8rem">
                      {formatter.format(new Date(props?.sharedPost?.createdAt))}
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <CardMedia
                    component={isImage ? "img" : "video"}
                    height="400"
                    src={props?.sharedPost?.media}
                    alt="post image"
                    sx={{ borderRadius: "1rem" }}
                    // sx={{ padding: "2rem", borderRadius: "3rem" }}
                  />
                </Box>
              </Box>
            ))}
          {props?.shared &&
            !props?.sharedPost?._id &&
            (postLoading ? (
              <Skeleton
                height={290}
                width="100%"
                animation="wave"
                variant="rectangular"
                // sx={{ mx: "auto", borderRadius: "1rem" }}
              />
            ) : (
              <Box
                sx={{
                  padding: "1rem",
                  border: "solid 1px #DFDFDF",
                  margin: "1rem",
                  borderRadius: "1rem",
                  cursor: "pointer",
                }}
              >
                <Box>
                  <CardContent height="400" sx={{ borderRadius: "1rem" }}>
                    <Typography fontWeight={500}>
                      This content isn't available at the moment
                    </Typography>
                    <Typography fontSize={"0.9rem"}>
                      When this happens, it's usually because the owner only
                      shared it with a small group of people or changed who can
                      see it, or it's been deleted.
                    </Typography>
                  </CardContent>
                </Box>
              </Box>
            ))}
          {open && (
            <Grow in={open}>
              <Box sx={{ padding: "1rem" }}>
                <Box sx={{ marginBottom: "1rem" }}>
                  {commentNumber > comments?.comments?.length && (
                    <Link sx={{ cursor: "pointer" }} onClick={loadMoreComments}>
                      Load more comments
                    </Link>
                  )}
                </Box>
                {allComments}
                <Box sx={{ display: "flex" }}>
                  <TextField
                    fullWidth
                    label="Add Comment"
                    variant="filled"
                    value={commentText}
                    onChange={(e) => {
                      setCommentText(e.target.value)
                      setError(false)
                    }}
                    error={!!error}
                    helperText={error}
                    onKeyDown={handleKeyDown}
                  />
                  <Button
                    variant="contained"
                    sx={{ marginLeft: "1rem" }}
                    onClick={handleComment}
                  >
                    <SendIcon />
                  </Button>
                </Box>
              </Box>
            </Grow>
          )}
          <CardActions
            sx={{ display: "flex", justifyContent: "space-between" }}
          >
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
              <Typography>{!!likeCount ? likeCount : "Like"}</Typography>
            </IconButton>
            <IconButton
              aria-label="comment"
              onClick={commentOpenHandler}
              sx={{ borderRadius: "0.5rem" }}
            >
              <ChatBubbleOutlineIcon color="primary" />
              <Typography>
                {commentNumber ? commentNumber : "Comment"}
              </Typography>
            </IconButton>
            <IconButton
              aria-label="share"
              sx={{ borderRadius: "0.5rem" }}
              onClick={handleSharePost}
            >
              <ShareIcon color="primary" />
              <Typography>Share</Typography>
            </IconButton>
          </CardActions>
          {openMenu && (
            <PostMenu
              handleClickAway={handleClickAway}
              checked={openMenu}
              postOwner={props?.createdBy?._id}
              postId={props?.postId}
            />
          )}
          {openMenu && <Box />}
          <ShareOptions
            handleShareClose={handleShareClose}
            anchorEl={anchorEl}
            postId={props?.postId}
            shared={props?.shared ? true : false}
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
        </Card>
      </ClickAwayListener>
    </>
  )
}

export default PostFeed
