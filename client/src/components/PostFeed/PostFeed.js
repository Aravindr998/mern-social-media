import React from "react"
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

function PostFeed(props) {
  const fromatter = new Intl.DateTimeFormat("en-GB", { dateStyle: "full" })
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
      <CardActions sx={{ display: "flex", justifyContent: "space-between" }}>
        <IconButton aria-label="like">
          <FavoriteBorderIcon color="primary" />
          <Typography>{props?.likes ? props.likes : "Like"}</Typography>
          {/* <FavoriteIcon/> */}
        </IconButton>
        <IconButton aria-label="comment">
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
