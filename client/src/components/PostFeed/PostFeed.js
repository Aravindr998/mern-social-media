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
import { Button, Divider, TextField } from "@mui/material"
import { Box } from "@mui/system"
import SendIcon from "@mui/icons-material/Send"
import { TOKEN_KEY } from "../../constants/constant"

function PostFeed(props) {
  const user = useSelector((state) => state.user)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [open, setOpen] = useState(false)
  const [comment, setComment] = useState([])
  const [commentText, setCommentText] = useState("")
  const [error, setError] = useState("")
  useEffect(() => {
    setLikeCount(props.likes)
    setComment(props.comments)
    if (props.liked) {
      console.log("entered")
      setLiked(true)
    }
  }, [props])
  let allComments
  if (comment.length > 0) {
    console.log(comment)
    allComments = comment.map((item) => {
      return (
        <Box
          key={item._id}
          sx={{ display: "flex", alignItems: "center", marginBottom: "1rem" }}
        >
          <Avatar src={item.userId?.profilePicture} />
          <Box>
            <Typography sx={{ marginLeft: "1rem" }}>
              {item.userId?.username}
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
    const payload = { comment: { text: commentText, userId: user } }
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
  return (
    <Card sx={{ width: { xs: "90%", sm: "50%" }, marginBottom: "1rem" }}>
      <CardHeader
        avatar={
          <Avatar
            sx={{ bgcolor: deepPurple[900] }}
            aria-label="profile-picture"
            src={props?.createdBy?.profilePicture}
          >
            {props?.createdBy?.firstName?.charAt(0)}
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={props?.createdBy?.username}
        subheader={fromatter.format(new Date(props?.createdAt))}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {props?.description}
        </Typography>
      </CardContent>
      {props?.media && (
        <CardMedia
          component="img"
          height="400"
          image={props?.media}
          alt="Paella dish"
          sx={{ padding: "2rem", borderRadius: "3rem" }}
        />
      )}
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
    </Card>
  )
}

export default PostFeed
