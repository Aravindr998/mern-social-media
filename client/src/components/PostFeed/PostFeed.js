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
import { useSelector } from "react-redux"
import {
  Button,
  ClickAwayListener,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  TextField,
} from "@mui/material"
import { Box } from "@mui/system"
import SendIcon from "@mui/icons-material/Send"
import PostMenu from "../PostMenu/PostMenu"

function PostFeed(props) {
  const user = useSelector((state) => state.user)
  const [liked, setLiked] = useState(false)
  const [postLoading, setPostLoading] = useState(true)
  const [likeCount, setLikeCount] = useState(0)
  const [open, setOpen] = useState(false)
  const [comment, setComment] = useState([])
  const [commentText, setCommentText] = useState("")
  const [error, setError] = useState("")
  const [openMenu, setOpenMenu] = useState(false)
  const [openEdit, setOpenEdit] = useState(false)
  const imageFormat = ["jpg", "jpeg", "png", "webp"]
  const handleEditPost = () => {
    setOpenEdit(true)
  }
  useEffect(() => {
    if (!props.loading) setPostLoading(false)
    setLikeCount(props.likes)
    setComment(props.comments)
    if (props.liked) {
      setLiked(true)
    }
  }, [props])
  function getUrlExtension(url) {
    return url.split(/[#?]/)[0].split(".").pop().trim()
  }
  let extension
  if (typeof props.media === "string") {
    extension = getUrlExtension(props.media)
  }
  let isImage = imageFormat.includes(extension)
  let allComments
  if (comment?.length > 0) {
    allComments = comment.map((item) => {
      return (
        <Box
          key={item._id}
          sx={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}
        >
          <Avatar src={item.userId[0]?.profilePicture} />
          <Box>
            <Typography sx={{ marginLeft: "1rem", fontWeight: "700" }}>
              {item.userId[0]?.username}
            </Typography>
            <Typography sx={{ marginLeft: "1rem" }}>{item.text}</Typography>
          </Box>
        </Box>
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
  const fromatter = new Intl.DateTimeFormat("en-GB", { dateStyle: "full" })
  const handleLike = () => {
    console.log(props.postId)
    axios
      .patch(
        "/api/post/like",
        { postId: props.postId },
        { headers: { Authorization: auth } }
      )
      .then(({ data }) => {
        setLiked((prevState) => !prevState)
        setLikeCount((prevState) => prevState + data.amount)
      })
      .catch((error) => {
        console.log(error)
      })
  }
  const handleComment = () => {
    const payload = { text: commentText, userId: user }
    axios
      .patch(
        "/api/post/comment",
        { comment: commentText, postId: props.postId },
        { headers: { Authorization: auth } }
      )
      .then(({ data }) => {
        if (data.success) {
          setComment((prevState) => {
            return [...prevState, payload]
          })
          setCommentText("")
        }
      })
      .catch(({ response }) => {
        console.log(response)
        if (response.status === 400) {
          setError(response.data.comment)
        }
      })
  }
  const handleClickAway = () => {
    setOpenMenu(false)
  }
  return (
    <>
      <Card
        sx={{
          width: { xs: "90%", sm: "50%" },
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
          action={
            postLoading ? null : (
              <IconButton
                aria-label="settings"
                onClick={() => {
                  setOpenMenu((prevState) => !prevState)
                }}
              >
                <MoreVertIcon />
              </IconButton>
            )
          }
          title={
            postLoading ? (
              <Skeleton
                animation="wave"
                height={10}
                width="50%"
                style={{ marginBottom: 6 }}
              />
            ) : (
              props?.createdBy?.username
            )
          }
          subheader={
            postLoading ? (
              <Skeleton animation="wave" height={10} width="40%" />
            ) : (
              fromatter.format(new Date(props?.createdAt))
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
            >
              {postLoading ? <Skeleton /> : props?.description}
            </Typography>
          </CardContent>
        )}
        {props?.media &&
          (postLoading ? (
            <Skeleton
              height={290}
              width="90%"
              animation="wave"
              variant="rectangular"
              sx={{ mx: "auto", borderRadius: "1rem" }}
            />
          ) : (
            <CardMedia
              component={isImage ? "img" : "video"}
              height="400"
              src={props?.media}
              alt="post image"
              sx={{ padding: "2rem", borderRadius: "3rem" }}
            />
          ))}
        {open && (
          <Box sx={{ padding: "1rem" }}>
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
        )}
        <CardActions sx={{ display: "flex", justifyContent: "space-between" }}>
          <IconButton aria-label="like" onClick={handleLike}>
            {!liked ? (
              <FavoriteBorderIcon color="primary" />
            ) : (
              <FavoriteIcon color="primary" />
            )}
            <Typography>{!!likeCount ? likeCount : "Like"}</Typography>
          </IconButton>
          <IconButton
            aria-label="comment"
            onClick={() => setOpen((prevState) => !prevState)}
          >
            <ChatBubbleOutlineIcon color="primary" />
            <Typography>
              {props?.comments?.length ? props.comments.length : "Comment"}
            </Typography>
          </IconButton>
          <IconButton aria-label="share">
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
            handleEditPost={handleEditPost}
          />
        )}
        {openMenu && <Box />}
      </Card>
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography sx={{ fontWeight: 700, fontSize: "1.5rem" }}>
              Create Post
            </Typography>
            <FormControl sx={{ width: "7rem" }}>
              <InputLabel id="demo-simple-select-label">Privacy</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                label="Privacy"
                // value={privacy}
                // onChange={(e) => {
                //   setPrivacy(e.target.value)
                //   setPrivacyError("")
                // }}
                // error={!!privacyError}
              >
                <MenuItem value={"public"}>Public</MenuItem>
                <MenuItem value={"private"}>Private</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogTitle>
        <DialogContent>
          <TextField
            variant="standard"
            label="Add a description"
            fullWidth
            // value={description}
            // onChange={(e) => {
            //   setDescription(e.target.value)
            //   setDescriptionError("")
            // }}
            // error={!!descriptionError}
            // helperText={descriptionError}
          />
          <Box
            sx={{ width: "100%", height: "15rem", mt: 2, mb: 2 }}
            component="img"
            // src={image}
          />
          <TextField
            autoFocus
            margin="dense"
            id="location"
            label="Location"
            type="text"
            fullWidth
            variant="standard"
            // value={location}
            // onChange={(e) => setLocation(e.target.value)}
          />
        </DialogContent>
        <DialogActions sx={{ display: "flex", flexDirection: "column" }}>
          <Button
            sx={{ mb: 3 }}
            variant="contained"
            fullWidth
            // onClick={handleSubmit}
          >
            Post
          </Button>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => {
              setOpenEdit(false)
            }}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default PostFeed
