import React, { useEffect, useState } from "react"
import {
  Avatar,
  Box,
  Button,
  Divider,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material"
import axios from "../../axios"
import { useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import DeleteConfirmation from "../DeleteConfirmation/DeleteConfirmation"

const columns = [
  { id: "media", label: "Media", minWidth: 100 },
  { id: "description", label: "Description", minWidth: 170 },
  { id: "likes", label: "Likes", minWidth: 170 },
  {
    id: "reports",
    label: "Reports",
    minWidth: 50,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "action",
    label: "Action",
    minWidth: 300,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
]

const AdminUserDetails = ({ drawerWidth }) => {
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [user, setUser] = useState({})
  const [posts, setPosts] = useState([])
  const [sortOrder, setSortOrder] = useState("desc")
  const [actions, setActions] = useState([])
  const [postToDelete, setPostToDelete] = useState("")
  const [open, setOpen] = useState(false)
  const adminAuth = useSelector((state) => state.adminAuth)
  const { userId } = useParams()
  const navigate = useNavigate()
  console.log(posts)
  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }
  useEffect(() => {
    ;(async () => {
      try {
        const { data } = await axios.get(`/api/admin/user/${userId}`, {
          headers: { Authorization: adminAuth },
        })
        setUser(data)
      } catch (error) {
        console.log(error)
      }
    })()
  }, [userId])
  useEffect(() => {
    ;(async () => {
      try {
        const { data } = await axios.get(`/api/admin/user/post/${userId}`, {
          headers: { Authorization: adminAuth },
        })
        setPosts(data)
      } catch (error) {
        console.log(error)
      }
    })()
  }, [userId])

  useEffect(() => {
    ;(async () => {
      try {
        const { data } = await axios.get(`/api/admin/user/actions/${userId}`, {
          headers: { Authorization: adminAuth },
        })
        setActions(data)
      } catch (error) {
        console.log(error)
      }
    })()
  }, [userId])

  const imageFormat = ["jpg", "jpeg", "png", "webp"]

  function getUrlExtension(url) {
    return url.split(/[#?]/)[0].split(".").pop().trim()
  }

  const sortColumn = (id, order) => {
    let sortFunction
    if (id === "reports") {
      if (sortOrder === "asc") {
        sortFunction = (a, b) => a.reported.length - b.reported.length
        setSortOrder("desc")
      } else {
        sortFunction = (a, b) => b.reported.length - a.reported.length
        setSortOrder("asc")
      }
      posts.sort(sortFunction)
    } else if (id === "likes") {
      if (sortOrder === "asc") {
        sortFunction = (a, b) => a.likes.length - b.likes.length
        setSortOrder("desc")
      } else {
        sortFunction = (a, b) => b.likes.length - a.likes.length
        setSortOrder("asc")
      }
      posts.sort(sortFunction)
    }
  }
  let allActions = <Typography>No actions to show</Typography>
  if (actions.length) {
    allActions = actions.map((item) => {
      console.log(item)
      let content, link, username
      if (item.type === "create") {
        username = item.userId.username
        content = "created a new post"
        link = `/post/${item.postId}`
      } else if (item.type === "post") {
        username = item.userId.username
        content = `${item.interaction} a post by ${item.postId.createdBy.username}`
        link = `/post/${item.postId}`
      } else if (item.type === "friendRequest") {
        username = item.userId.username
        content = `sent friend request to ${item.to.username}`
        link = `/profile/${item.userId.username}`
      } else if (item.type === "acceptedRequest") {
        username = item.userId.username
        content = `accepted a friend request by ${item.to.username}`
        link = `/profile/${item.userId.username}`
      }
      return (
        <React.Fragment key={item._id}>
          <Box
            sx={{
              padding: "1rem",
              "&:hover": { backgroundColor: "#DFDFDF" },
              borderRadius: "0.5rem",
              transition: "background-color 0.3s",
              cursor: "pointer",
            }}
          >
            <Typography>
              <Typography component="span" fontWeight={700}>
                {username}
              </Typography>{" "}
              {content}
            </Typography>
          </Box>
          <Divider />
        </React.Fragment>
      )
    })
  }
  let allFriends
  if (user?.friends?.length) {
    allFriends = user?.friends?.map((friend) => {
      return (
        <Tooltip title="View Details" placement="left">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              padding: "1rem",
              cursor: "pointer",
            }}
            onClick={() => navigate(`/admin/users/${friend._id}`)}
          >
            <Avatar
              sx={{ marginRight: "0.5rem" }}
              src={friend.profilePicture}
            />
            <Typography fontWeight={500}>{friend.username}</Typography>
          </Box>
        </Tooltip>
      )
    })
  }

  const handleDeleteConfirmation = async (postId) => {
    setPostToDelete(postId)
    setOpen(true)
  }
  const handleCloseConfirmation = async (postId) => {
    setPostToDelete("")
    setOpen(false)
  }
  const removePost = (data) => {
    setPosts((prevState) => {
      return prevState.filter((item) => item._id != data._id)
    })
    setOpen(false)
  }
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        marginTop: "4rem",
        width: { sm: `calc(100% - ${drawerWidth}px)` },
      }}
    >
      <Paper sx={{ width: "100%" }}>
        <Box
          sx={{
            backgroundImage: `url(${
              user?.coverPicture || "/images/cover-picture.png"
            })`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "50% 50%",
            position: "relative",
          }}
          width="100%"
          height="15rem"
        >
          <Box
            component="img"
            src={user?.profilePicture || "/images/avatar.jpg"}
            width="12rem"
            height="12rem"
            sx={{ objectFit: "cover" }}
            position="absolute"
            bottom={-90}
            left={60}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "end",
            flexDirection: "column",
            padding: "1.5rem",
          }}
        >
          <Typography fontWeight={700} fontSize={"1.3rem"}>
            Details
          </Typography>
          <Typography
            fontSize={"2rem"}
            fontWeight={700}
          >{`${user?.firstName} ${user.lastName}`}</Typography>
          <Typography color={"GrayText"}>{user?.username}</Typography>
          <Typography>{user?.email}</Typography>
        </Box>
        <Box sx={{ maxWidth: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table aria-label="table">
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{
                        top: 57,
                        minWidth: column.minWidth,
                        backgroundColor: "#DFDFDF",
                        cursor: "pointer",
                      }}
                      onClick={() => sortColumn(column.id, sortOrder)}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {posts.length ? (
                  posts
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {
                      let extension
                      if (typeof row.media === "string") {
                        extension = getUrlExtension(row.media)
                      } else if (typeof row?.sharedPost?.media === "string")
                        extension = getUrlExtension(row.sharedPost.media)
                      let isImage = imageFormat.includes(extension)
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={row._id}
                        >
                          {columns.map((column) => {
                            const value = row[column.id]
                            if (column.id === "action") {
                              return (
                                <TableCell key={column.id} align={column.align}>
                                  <Button
                                    variant="outlined"
                                    color="info"
                                    sx={{ marginRight: "0.5rem" }}
                                    // onClick={() => handleViewDetails(row._id)}
                                  >
                                    View Details
                                  </Button>
                                  <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => {
                                      handleDeleteConfirmation(row._id)
                                    }}
                                  >
                                    Delete
                                  </Button>
                                </TableCell>
                              )
                            } else if (column.id === "likes") {
                              return (
                                <TableCell key={column.id} align={column.align}>
                                  {row.likes.length}
                                </TableCell>
                              )
                            } else if (column.id === "reports") {
                              return (
                                <TableCell key={column.id} align={column.align}>
                                  {row.reported.length}
                                </TableCell>
                              )
                            } else if (column.id === "media") {
                              return (
                                <TableCell key={column.id} align={column.align}>
                                  <Box>
                                    <Box
                                      width={"100%"}
                                      component={isImage ? "img" : "video"}
                                      src={row.media}
                                    />
                                  </Box>
                                </TableCell>
                              )
                            }
                            return (
                              <TableCell key={column.id} align={column.align}>
                                {value}
                              </TableCell>
                            )
                          })}
                        </TableRow>
                      )
                    })
                ) : (
                  <TableRow>No posts to list</TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={posts.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
        <Typography
          fontSize={"1.5rem"}
          fontWeight={500}
          sx={{ padding: "1rem" }}
        >
          Actions
        </Typography>
        <Box sx={{ maxHeight: "30rem", overflowY: "auto" }}>
          <Typography sx={{ padding: "1rem" }}>Actions done by user</Typography>
          <Stack
            sx={{ padding: "1rem", maxHeight: "100%", overflowY: "auto" }}
            spacing={2}
          >
            {allActions}
          </Stack>
        </Box>
        <Box>
          <Typography
            fontSize={"1.5rem"}
            fontWeight={500}
            sx={{ padding: "1rem" }}
          >
            Friends
          </Typography>
          <Stack>{allFriends}</Stack>
        </Box>
      </Paper>
      <DeleteConfirmation
        postId={postToDelete}
        show={open}
        handleCloseConfirmation={handleCloseConfirmation}
        removePost={removePost}
      />
    </Box>
  )
}

export default AdminUserDetails
