import React from "react"
import Card from "@mui/material/Card"
import CardHeader from "@mui/material/CardHeader"
import CardMedia from "@mui/material/CardMedia"
import CardContent from "@mui/material/CardContent"
import CardActions from "@mui/material/CardActions"
import Avatar from "@mui/material/Avatar"
import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import { red } from "@mui/material/colors"
import FavoriteIcon from "@mui/icons-material/Favorite"
import ShareIcon from "@mui/icons-material/Share"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder"
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline"

function PostFeed(props) {
  return (
    <Card sx={{ maxWidth: { xs: "90%", sm: "50%" }, marginBottom: "1rem" }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
            R
          </Avatar>
        }
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title="Shrimp and Chorizo Paella"
        subheader="September 14, 2016"
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          This impressive paella is a perfect party dish and a fun meal to cook
          together with your guests. Add 1 cup of frozen peas along with the
          mussels, if you like.
        </Typography>
      </CardContent>
      <CardMedia
        component="img"
        height="400"
        image="https://picsum.photos/200/300"
        alt="Paella dish"
        sx={{ padding: "2rem", borderRadius: "3rem" }}
      />
      <CardActions sx={{ display: "flex", justifyContent: "space-between" }}>
        <IconButton aria-label="like">
          <FavoriteBorderIcon color="primary" />
          <Typography>200</Typography>
          {/* <FavoriteIcon/> */}
        </IconButton>
        <IconButton aria-label="comment">
          <ChatBubbleOutlineIcon color="primary" />
          <Typography>Comment</Typography>
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
