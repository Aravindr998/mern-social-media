import React, { useCallback, useEffect, useMemo, useState } from "react"
import PropTypes from "prop-types"
import Box from "@mui/material/Box"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TablePagination from "@mui/material/TablePagination"
import TableRow from "@mui/material/TableRow"
import TableSortLabel from "@mui/material/TableSortLabel"
import Typography from "@mui/material/Typography"
import Paper from "@mui/material/Paper"
import { visuallyHidden } from "@mui/utils"
import axios from "../../axios"
import { useSelector } from "react-redux"
import { Outlet, useNavigate, useParams } from "react-router-dom"
import { Avatar, Button } from "@mui/material"

function descendingComparator(a, b, orderBy) {
  if (orderBy === "reports") {
    if (b.reported.length < a.reported.length) {
      return -1
    }
    if (b.reported.length > a.reported.length) {
      return 1
    }
    return 0
  } else if (orderBy === "likes") {
    if (b[orderBy].length < a[orderBy].length) {
      return -1
    }
    if (b[orderBy].length > a[orderBy].length) {
      return 1
    }
    return 0
  } else {
    if (b[orderBy] < a[orderBy]) {
      return -1
    }
    if (b[orderBy] > a[orderBy]) {
      return 1
    }
    return 0
  }
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) {
      return order
    }
    return a[1] - b[1]
  })
  return stabilizedThis.map((el) => el[0])
}

const headCells = [
  {
    id: "profilePicture",
    numeric: false,
    disablePadding: false,
    maxWidth: 100,
    label: "Profile Picture",
  },
  {
    id: "username",
    numeric: false,
    disablePadding: false,
    maxWidth: 100,
    label: "Username",
  },
  {
    id: "subscriptionStatus",
    numeric: false,
    disablePadding: false,
    maxWidth: 100,
    label: "Subscription Status",
  },
  {
    id: "createdAt",
    numeric: false,
    disablePadding: false,
    maxWidth: 100,
    label: "Created At",
  },
  {
    id: "actions",
    numeric: false,
    disablePadding: false,
    maxWidth: 100,
    label: "Actions",
  },
]

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
            style={{ maxWidth: headCell.maxWidth }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
}

const AdminElite = ({ drawerWidth }) => {
  const adminAuth = useSelector((state) => state.adminAuth)
  const navigate = useNavigate()
  const { postId } = useParams()
  const [order, setOrder] = useState("asc")
  const [orderBy, setOrderBy] = useState("reports")
  const [selected, setSelected] = useState([])
  const [page, setPage] = useState(0)
  const [dense, setDense] = useState(false)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const [posts, setPosts] = useState([])
  const [postToDelete, setPostToDelete] = useState("")
  const [open, setOpen] = useState(false)

  useEffect(() => {
    ;(async () => {
      try {
        const { data } = await axios.get("/api/payment/subscription/all", {
          headers: { Authorization: adminAuth },
        })
        setPosts(data)
        console.log(data)
      } catch (error) {
        console.log(error)
      }
    })()
  }, [])

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc"
    setOrder(isAsc ? "desc" : "asc")
    setOrderBy(property)
  }

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = posts.map((n) => n.name)
      setSelected(newSelected)
      return
    }
    setSelected([])
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const isSelected = (name) => selected.indexOf(name) !== -1

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - posts.length) : 0

  const visibleRows = useMemo(
    () =>
      stableSort(posts, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage, posts]
  )
  const handleCloseConfirmation = async (postId) => {
    setPostToDelete("")
    setOpen(false)
  }
  const removePost = useCallback((data) => {
    setPosts((prevState) => {
      return prevState.filter((item) => item._id != data._id)
    })
    setOpen(false)
  })
  const imageFormat = ["jpg", "jpeg", "png", "webp"]

  function getUrlExtension(url) {
    return url.split(/[#?]/)[0].split(".").pop().trim()
  }

  const handleAccept = async (userId) => {
    try {
      const { data } = await axios.patch(
        `/api/payment/subscription/confirm`,
        { userId },
        { headers: { Authorization: adminAuth } }
      )
      setPosts(data)
    } catch (error) {
      console.log(error)
    }
  }

  const handleDeny = async (userId) => {
    try {
      const { data } = await axios.patch(
        `/api/payment/subscription/deny`,
        { userId },
        { headers: { Authorization: adminAuth } }
      )
      setPosts(data)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          marginTop: "4rem",
          width: { sm: `calc(100% - ${drawerWidth}px)` },
        }}
      >
        {postId ? (
          <Outlet context={removePost} />
        ) : (
          <Box sx={{ width: "100%" }}>
            <Paper sx={{ width: "100%", mb: 2 }}>
              <TableContainer>
                <Table
                  sx={{ minWidth: 750 }}
                  aria-labelledby="tableTitle"
                  size={dense ? "small" : "medium"}
                >
                  <EnhancedTableHead
                    numSelected={selected.length}
                    order={order}
                    orderBy={orderBy}
                    onSelectAllClick={handleSelectAllClick}
                    onRequestSort={handleRequestSort}
                    rowCount={posts.length}
                  />
                  <TableBody>
                    {visibleRows.map((row, index) => {
                      const labelId = `enhanced-table-checkbox-${index}`

                      let actions = (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "flex-start",
                          }}
                        >
                          <Button
                            variant="outlined"
                            color="info"
                            onClick={() => {
                              navigate(`/admin/posts/${row._id}`)
                            }}
                          >
                            View Details
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            sx={{ marginLeft: "1rem" }}
                            onClick={() => {
                              setOpen(true)
                              setPostToDelete(row._id)
                            }}
                          >
                            Delete
                          </Button>
                        </Box>
                      )
                      if (row.eliteVerified === "pending") {
                        actions = (
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "flex-start",
                            }}
                          >
                            <Button
                              variant="contained"
                              color="info"
                              onClick={() => {
                                handleAccept(row._id)
                              }}
                            >
                              Accept
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              sx={{ marginLeft: "1rem" }}
                              onClick={() => {
                                handleDeny(row._id)
                              }}
                            >
                              Deny
                            </Button>
                          </Box>
                        )
                      } else if (row.eliteVerified === "verified") {
                        actions = (
                          <Box>
                            <Button>Cancel</Button>
                          </Box>
                        )
                      } else if (row.eliteVerified === "rejected") {
                        actions = (
                          <Box>
                            <Button disabled={true}>Rejected</Button>
                          </Box>
                        )
                      }

                      return (
                        <TableRow
                          hover
                          key={row.profilePicture}
                          sx={{ cursor: "pointer" }}
                        >
                          <TableCell id={labelId}>
                            <Avatar src={row.profilePicture} />
                          </TableCell>
                          <TableCell>{row.username}</TableCell>
                          <TableCell align="left">
                            <Typography
                              fontWeight={500}
                              sx={{
                                "&:hover": { textDecoration: "underline" },
                              }}
                            >
                              {row.payment.status}
                            </Typography>
                          </TableCell>
                          <TableCell align="left">
                            {new Date(row.payment.createdAt)
                              .toString()
                              .slice(0, 16)}
                          </TableCell>
                          <TableCell align="right">{actions}</TableCell>
                        </TableRow>
                      )
                    })}
                    {emptyRows > 0 && (
                      <TableRow
                        style={{
                          height: (dense ? 33 : 53) * emptyRows,
                        }}
                      >
                        <TableCell colSpan={6} />
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={posts.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Paper>
          </Box>
        )}
      </Box>
    </>
  )
}

export default AdminElite
