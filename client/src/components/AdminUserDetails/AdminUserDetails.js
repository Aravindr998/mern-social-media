import React, { useEffect, useState } from "react"
import {
  Avatar,
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material"
import axios from "../../axios"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"

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
  const adminAuth = useSelector((state) => state.adminAuth)
  const { userId } = useParams()
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
  }, [])
  useEffect(() => {
    ;(async () => {
      try {
        const { data } = await axios.get(`/api/admin/post/${userId}`, {
          headers: { Authorization: adminAuth },
        })
        setPosts(data)
      } catch (error) {
        console.log(error)
      }
    })()
  }, [])
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
            backgroundImage: `url(${user?.coverPicture})`,
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
            src={user?.profilePicture}
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
        <Box sx={{ maxWidth: "100%", overflowX: "auto" }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <Table aria-label="sticky table">
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
                      }}
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
                      console.log(row)
                      return (
                        <TableRow
                          hover
                          role="checkbox"
                          tabIndex={-1}
                          key={row._id}
                        >
                          {columns.map((column) => {
                            console.log(column)
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
                                    // onClick={() => {
                                    //   handleBlockUser(row._id)
                                    // }}
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
                                      component={"img"}
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
                  <TableRow>No users to list</TableRow>
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
      </Paper>
    </Box>
  )
}

export default AdminUserDetails
