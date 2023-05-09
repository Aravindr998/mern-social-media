import React, { useEffect, useState } from "react"
import Paper from "@mui/material/Paper"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TablePagination from "@mui/material/TablePagination"
import TableRow from "@mui/material/TableRow"
import { useDispatch, useSelector } from "react-redux"
import { Avatar, Box, Button, TextField, Typography } from "@mui/material"
import {
  editUserList,
  fetchAllUsers,
} from "../../features/allUsersSlice/allUsersSlice"
import { clearAdminAuth } from "../../features/adminAuth/adminAuthSlice"
import { ADMIN_TOKEN_KEY } from "../../constants/constant"
import axios from "../../axios"
import { useNavigate } from "react-router-dom"

const columns = [
  { id: "profilePicture", label: "Picture", minWidth: 100 },
  { id: "firstName", label: "Name", minWidth: 170 },
  { id: "username", label: "User Name", minWidth: 170 },
  {
    id: "email",
    label: "Email",
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "action",
    label: "Action",
    minWidth: 170,
    align: "right",
    format: (value) => value.toLocaleString("en-US"),
  },
]

function AdminUserList({ drawerWidth }) {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [search, setSearch] = useState("")
  const allUsers = useSelector((state) => state.allUsers)
  const adminAuth = useSelector((state) => state.adminAuth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(fetchAllUsers())
  }, [])

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }
  if (allUsers?.error === "Request failed with status code 401") {
    localStorage.removeItem(ADMIN_TOKEN_KEY)
    dispatch(clearAdminAuth())
  }
  const handleBlockUser = async (id) => {
    try {
      const { data } = await axios.patch(
        "/api/admin/user/block",
        { userId: id },
        { headers: { Authorization: adminAuth } }
      )
      dispatch(editUserList(data))
    } catch (error) {
      console.log(error)
    }
  }
  const handleViewDetails = async (id) => {
    navigate(`/admin/users/${id}`)
  }

  const filteredUsers = allUsers?.users?.filter((item) => {
    if (item.firstName.search(new RegExp(search, "i")) !== -1) {
      return item
    } else if (item.username.search(search, "i") !== -1) {
      return item
    }
  })

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        marginTop: "6rem",
        width: { sm: `calc(100% - ${drawerWidth}px)` },
      }}
    >
      <Box
        sx={{
          marginBottom: "0.5rem",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <TextField
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>
      <Paper sx={{ width: "100%" }}>
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
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers ? (
                filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
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
                                  variant="contained"
                                  color="info"
                                  sx={{ marginRight: "0.5rem" }}
                                  onClick={() => handleViewDetails(row._id)}
                                >
                                  View Details
                                </Button>
                                <Button
                                  variant="outlined"
                                  color="warning"
                                  onClick={() => {
                                    handleBlockUser(row._id)
                                  }}
                                >
                                  {row.isBlocked ? "Unblock" : "Block"}
                                </Button>
                              </TableCell>
                            )
                          } else if (column.id === "profilePicture") {
                            return (
                              <TableCell key={column.id} align={column.align}>
                                <Avatar src={value} />
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
          count={filteredUsers?.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Box>
  )
}

export default AdminUserList
