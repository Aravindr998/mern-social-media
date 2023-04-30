import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material"
import axios from "../../axios"
import React, { useEffect, useState } from "react"
import { useNavigate, useOutletContext, useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import FavoriteIcon from "@mui/icons-material/Favorite"
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline"
import MoreVertIcon from "@mui/icons-material/MoreVert"
import ShowFriends from "../ShowFriends/ShowFriends"
import DeleteConfirmation from "../DeleteConfirmation/DeleteConfirmation"

const AdminPostDetails = () => {
  const { postId } = useParams()
  const navigate = useNavigate()
  const adminAuth = useSelector((state) => state.adminAuth)

  const [post, setPost] = useState({})
  const [open, setOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [anchorElComments, setAnchorElComments] = useState(null)
  const [show, setShow] = useState(false)

  const removePost = useOutletContext()

  const formatter = new Intl.DateTimeFormat("en-GB", { dateStyle: "full" })
  useEffect(() => {
    ;(async () => {
      try {
        console.log(postId)
        const { data } = await axios.get(`/api/admin/post/${postId}`, {
          headers: { Authorization: adminAuth },
        })
        console.log(data)
        setPost(data)
      } catch (error) {
        const { response } = error
        if (response) {
          if (response.status === 404) {
            console.log("requested post does not exist")
            //redirect to page not found
          } else if (response.status === 301) {
            navigate(`/admin/posts/${response.data.id}`)
          } else {
            //redirect to content isn't availabe
          }
        } else {
          console.log(error)
        }
      }
    })()
  }, [postId])
  const openCommentMenu = Boolean(anchorElComments)
  const handleCommentClick = (event) => {
    setAnchorElComments(event.currentTarget)
  }
  const handleCommentClose = () => {
    setAnchorElComments(null)
  }
  const handleCommentDelete = () => {
    setShow(true)
  }
  let allComments
  if (post?.comments?.length > 0) {
    allComments = post.comments.map((item) => {
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
            <IconButton aria-label="settings" onClick={handleCommentClick}>
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
  const handleCloseLikes = () => {
    setOpen(false)
  }
  const handleOpenLikes = () => {
    setOpen(true)
  }
  const openMenu = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const handleDelete = () => {
    setShow(true)
  }
  const handleCloseConfirmation = () => {
    setShow(false)
  }
  const redirectAfterDelete = (data) => {
    removePost(data)
    navigate("/admin/posts")
  }
  return (
    <Box sx={{ marginTop: "-1.5rem", display: "flex" }}>
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
              <Typography fontWeight={500}>
                {post.createdBy?.username}
              </Typography>
              {post.createdAt && (
                <Typography fontSize="0.9rem">
                  {formatter.format(new Date(post.createdAt))}
                </Typography>
              )}
            </Box>
          </Box>
          <IconButton onClick={handleClick}>
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
            sx={{ borderRadius: "0.5rem" }}
            onClick={handleOpenLikes}
          >
            <FavoriteIcon color="primary" />
            <Typography>{post?.likes?.length}</Typography>
          </IconButton>
          <IconButton aria-label="comment" sx={{ borderRadius: "0.5rem" }}>
            <ChatBubbleOutlineIcon color="primary" />
            <Typography>{post?.comments?.length}</Typography>
          </IconButton>
        </Box>
        <Divider />
        <Box sx={{ padding: "0.5rem", cursor: "pointer" }}></Box>
        <Box sx={{ height: "70%" }}>
          <Box
            sx={{ height: "100%", overflowY: "auto", paddingInline: "1rem" }}
          >
            {allComments}
          </Box>
        </Box>
      </Box>
      <ShowFriends
        likes={post?.likes}
        show={open}
        handleCloseLikes={handleCloseLikes}
      />
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
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
        <MenuItem onClick={handleDelete}>Delete Post</MenuItem>
      </Menu>
      <DeleteConfirmation
        show={show}
        handleCloseConfirmation={handleCloseConfirmation}
        postId={post._id}
        removePost={redirectAfterDelete}
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
    </Box>
  )
}

export default AdminPostDetails
