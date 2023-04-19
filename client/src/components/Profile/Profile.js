import { useTheme } from "@emotion/react"
import { Button, Typography } from "@mui/material"
import { Box } from "@mui/system"
import React, { useEffect, useState } from "react"
import Create from "../Create/Create"
import PostFeed from "../PostFeed/PostFeed"
import axios from "../../axios"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import Skeleton from "@mui/material/Skeleton"

function Profile() {
  const theme = useTheme()
  const { username } = useParams()
  const [userLoading, setUserLoading] = useState(true)
  const [posts, setPosts] = useState([])
  const [user, setUser] = useState({})
  const [authorized, setAuthorized] = useState(false)
  const [friend, setFriend] = useState("Add Friend")
  const [request, setRequest] = useState(false)
  const auth = useSelector((state) => state.auth)
  const loggedinUser = useSelector((state) => state.user)
  useEffect(() => {
    axios
      .get(`/api/user/profile/${username}`, {
        headers: { Authorization: auth },
      })
      .then(({ data }) => {
        setUserLoading(false)
        setUser(data.user)
        if (data.user?._id === data.loggedinUser?.id) {
          setAuthorized(true)
        } else {
          setAuthorized(false)
        }
        if (data.friend) {
          setFriend("Unfriend")
        } else if (data.pending) {
          setFriend("Request Sent")
        }
        if (data.requestReceived) {
          setRequest(true)
        }
      })
      .catch(({ response }) => {
        setUserLoading(false)
        console.log(response)
      })
  }, [username])
  useEffect(() => {
    axios
      .get(`/api/post/user/${username}`, {
        headers: { Authorization: auth },
      })
      .then(({ data }) => {
        setPosts(data.posts)
      })
      .catch(({ response }) => {
        console.log(response)
      })
  }, [username])
  const friendHandler = () => {
    axios
      .patch(
        "/api/friend/change",
        { id: user._id },
        { headers: { Authorization: auth } }
      )
      .then(({ data }) => {
        if (data.success) {
          if (data.message === "Unfriend") {
            setRequest((prevState) => !prevState)
          }
          setFriend(data.message)
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }
  let postFeed
  if (posts.length > 0) {
    postFeed = posts.map((post) => {
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
          liked={post.likes.includes(loggedinUser._id)}
        />
      )
    })
  } else {
    postFeed = <Typography>No Posts To Show</Typography>
  }
  return (
    <>
      <Box sx={{ width: { xs: "100%", sm: "50%" } }}>
        <Box sx={{ width: "100%", height: "30vh", position: "relative" }}>
          <Box
            sx={{ objectFit: "cover", width: "100%", height: "100%" }}
            component="img"
            src={
              user.coverPicture
                ? user.coverPicture
                : "/images/cover-picture.png"
            }
          />
          <Box
            sx={{
              objectFit: "cover",
              width: 150,
              height: 150,
              borderRadius: "5rem",
              position: "absolute",
              top: "100%",
              right: { xs: "50%", lg: "15%" },
              transform: "translate(50%, -50%)",
            }}
            component="img"
            src={user.profilePicture ? user.profilePicture : "/images/user.png"}
          />
        </Box>
        <Box
          sx={{
            marginTop: { xs: "5rem", lg: "0.5rem" },
            display: "flex",
            flexDirection: "column",
            alignItems: { xs: "center", lg: "flex-start" },
          }}
        >
          <Typography sx={{ fontSize: "2rem", fontWeight: 700 }}>
            {userLoading ? (
              <Skeleton width="15rem" />
            ) : (
              user.firstName + " " + user.lastName
            )}
          </Typography>
          <Typography
            sx={{
              fontSize: "1rem",
              fontWeight: 400,
              color: theme.palette.mode === "dark" ? "#777481" : "#777481",
            }}
          >
            {userLoading ? <Skeleton width={120} /> : user.username}
          </Typography>
        </Box>
        {authorized && (
          <Box
            mt={2}
            mb={3}
            sx={{
              display: "flex",
              justifyContent: { xs: "center", lg: "flex-start" },
            }}
          >
            <Button variant="outlined">Edit Profile</Button>
            <Button variant="contained" sx={{ marginLeft: 2 }}>
              View Friends
            </Button>
          </Box>
        )}
        {!authorized && (
          <Box
            mt={2}
            mb={3}
            sx={{
              display: "flex",
              justifyContent: { xs: "center", lg: "flex-start" },
            }}
          >
            {!request ? (
              <Button variant="outlined" onClick={friendHandler}>
                {friend}
              </Button>
            ) : (
              <Button variant="contained" onClick={friendHandler}>
                Accept Request
              </Button>
            )}
            <Button variant="outlined" color="error" sx={{ marginLeft: 2 }}>
              Block
            </Button>
          </Box>
        )}
      </Box>
      <Create />
      {postFeed}
    </>
  )
}

export default Profile
