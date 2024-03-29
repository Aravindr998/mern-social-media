import { useTheme } from "@emotion/react"
import { Button, Tooltip, Typography } from "@mui/material"
import { Box } from "@mui/system"
import React, { useEffect, useState } from "react"
import Create from "../Create/Create"
import PostFeed from "../PostFeed/PostFeed"
import axios from "../../axios"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import Skeleton from "@mui/material/Skeleton"
import { socket } from "../../socket"
import { fetchProfilePosts } from "../../features/ProfilePosts/ProfilePosts"
import BookmarkIcon from "@mui/icons-material/Bookmark"
import VerifiedIcon from "@mui/icons-material/Verified"

function Profile() {
  const theme = useTheme()
  const { username } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const posts = useSelector((state) => state.profilePosts)
  const [userLoading, setUserLoading] = useState(true)
  // const [posts, setPosts] = useState([])
  const [user, setUser] = useState({})
  const [authorized, setAuthorized] = useState(false)
  const [friend, setFriend] = useState("Add Friend")
  const [request, setRequest] = useState(false)
  // const [loading, setLoading] = useState(true)
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
        console.log(data)
        if (data.friend) {
          // console.log(data)
          console.log("unfriend")
          setFriend("Unfriend")
        } else if (data.pending) {
          setFriend("Request Sent")
        } else {
          setFriend("Add Friend")
        }
        if (data.requestReceived) {
          setRequest(true)
        }
        dispatch(fetchProfilePosts(username))
      })
      .catch(({ response }) => {
        setUserLoading(false)
        console.log(response)
      })
  }, [username])
  // useEffect(() => {
  // }, [username])
  const friendHandler = () => {
    axios
      .patch(
        "/api/friend/change",
        { id: user?._id },
        { headers: { Authorization: auth } }
      )
      .then(({ data }) => {
        if (data.success) {
          if (data.message === "Unfriend") {
            setRequest((prevState) => !prevState)
          }
          setFriend(data.message)
          if (data.message === "Request Sent") {
            socket.emit("friendRequest", data.notification)
          }
          if (data.message === "Unfriend") {
            socket.emit("friendRequest", data.notification)
          }
        }
      })
      .catch((error) => {
        console.log(error)
      })
  }
  let postFeed
  if (posts?.posts?.length > 0) {
    postFeed = posts?.posts?.map((post) => {
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
          liked={post.likes.includes(loggedinUser?._id)}
          privacy={post.privacy}
          sharedPost={post.postId}
          loading={posts?.loading}
        />
      )
    })
  } else {
    postFeed = <Typography>No Posts To Show</Typography>
  }
  return (
    <>
      <Box sx={{ width: { xs: "90%", lg: "50%" } }}>
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
          <Box display={"flex"} alignItems={"center"}>
            <Typography sx={{ fontSize: "2rem", fontWeight: 700 }}>
              {userLoading ? (
                <Skeleton width="15rem" />
              ) : (
                user.firstName + " " + user.lastName
              )}
            </Typography>
            {user?.elite && (
              <Tooltip title="Verfied">
                <VerifiedIcon
                  sx={{ marginLeft: "0.5rem", cursor: "pointer" }}
                  color="primary"
                />
              </Tooltip>
            )}
          </Box>
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
            display={"flex"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Box
              mt={2}
              mb={3}
              sx={{
                display: "flex",
                justifyContent: { xs: "center", lg: "flex-start" },
              }}
            >
              <Button
                variant="outlined"
                onClick={() => navigate("/profile/details/edit")}
              >
                Edit Profile
              </Button>
              <Button
                variant="contained"
                sx={{ marginLeft: 2 }}
                onClick={() => navigate(`/profile/${username}/friends`)}
              >
                View Friends
              </Button>
            </Box>
            <Button
              variant="outlined"
              startIcon={<BookmarkIcon />}
              onClick={() => {
                navigate("/posts/saved")
              }}
            >
              Saved Posts
            </Button>
          </Box>
        )}
        {!authorized && !userLoading ? (
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
        ) : null}
      </Box>
      <Create />
      {postFeed}
    </>
  )
}

export default Profile
