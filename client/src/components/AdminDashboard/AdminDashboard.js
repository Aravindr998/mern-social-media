import React, { useEffect, useState } from "react"
import { Box, Button, Card, Select, Toolbar, Typography } from "@mui/material"
import PostChart from "../PostChart/PostChart"
import axios from "../../axios"
import { useSelector } from "react-redux"

const AdminDashboard = ({ drawerWidth }) => {
  const [totalPosts, setTotalPosts] = useState(0)
  const [totalMedia, setTotalMedia] = useState(0)
  const [totalUsers, setTotalUsers] = useState(0)
  const [eliteUsers, setEliteUsers] = useState(0)
  const adminAuth = useSelector((state) => state.adminAuth)
  const date = useSelector((state) => state.adminDashboard)
  useEffect(() => {
    ;(async () => {
      try {
        const { data } = await axios.get("/api/admin/dashboard/details", {
          headers: { Authorization: adminAuth },
        })
        setTotalMedia(data.totalMedia)
        setTotalUsers(data.totalUsers)
        setTotalPosts(data.totalPosts)
        setEliteUsers(data.eliteUsers)
      } catch (error) {
        console.log(error)
      }
    })()
  }, [])

  const handleDownloadAsPDF = async () => {
    try {
      const { data } = await axios.get(
        `/api/admin/post/details/pdf?month=${date}`,
        {
          responseType: "blob",
          headers: { Authorization: adminAuth },
        }
      )
      console.log(data)
      const url = URL.createObjectURL(data)
      const a = document.createElement("a")
      a.href = url
      a.download = "data.pdf"
      document.body.appendChild(a)
      a.click()
      a.remove()
    } catch (error) {
      console.log(error)
    }
  }
  const handleDownloadAsExcel = async () => {
    try {
      const { data } = await axios.get(
        `/api/admin/post/details/excel?month=${date}`,
        {
          responseType: "blob",
          headers: { Authorization: adminAuth },
        }
      )
      const url = URL.createObjectURL(data)
      const a = document.createElement("a")
      a.href = url
      a.download = "table.xlsx"
      document.body.appendChild(a)
      a.click()
      a.remove()
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        width: { sm: `calc(100% - ${drawerWidth}px)` },
      }}
    >
      <Toolbar />
      <Box
        sx={{
          display: { sm: "block", lg: "flex" },
          justifyContent: "space-between",
        }}
      >
        <Card
          sx={{
            padding: "1rem",
            display: "flex",
            marginBottom: "1rem",
          }}
        >
          <Box
            component={"img"}
            src="/images/addgroup.png"
            width={"4rem"}
            marginRight={"1rem"}
          />
          <Box textAlign={"center"}>
            <Typography fontWeight={700}>Total Users</Typography>
            <Typography>{totalUsers}</Typography>
          </Box>
        </Card>
        <Card
          sx={{
            padding: "1rem 2rem",
            display: "flex",
            marginBottom: "1rem",
          }}
        >
          <Box
            component={"img"}
            src="/images/post.png"
            width={"4rem"}
            marginRight={"1rem"}
          />
          <Box textAlign={"center"}>
            <Typography fontWeight={700}>Total Posts</Typography>
            <Typography>{totalPosts}</Typography>
          </Box>
        </Card>
        <Card
          sx={{
            padding: "1rem 2rem",
            display: "flex",
            marginBottom: "1rem",
          }}
        >
          <Box
            component={"img"}
            src="/images/photo.png"
            width={"4rem"}
            marginRight={"1rem"}
          />
          <Box textAlign={"center"}>
            <Typography fontWeight={700}>Total Media</Typography>
            <Typography>{totalMedia}</Typography>
          </Box>
        </Card>
        <Card
          sx={{
            padding: "1rem 2rem",
            display: "flex",
            marginBottom: "1rem",
          }}
        >
          <Box
            component={"img"}
            src="/images/verified.png"
            width={"4rem"}
            marginRight={"1rem"}
          />
          <Box textAlign={"center"}>
            <Typography fontWeight={700}>Elite Users</Typography>
            <Typography>{eliteUsers}</Typography>
          </Box>
        </Card>
      </Box>
      <Box>
        <PostChart />
      </Box>
      <Box>
        <Card
          sx={{
            display: "flex",
            padding: "1rem",
            marginTop: "1rem",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography>Download Post Reports</Typography>
          <Box sx={{ display: "flex" }}>
            <Button variant="contained" onClick={handleDownloadAsPDF}>
              Download as PDF
            </Button>
            <Button
              variant="contained"
              sx={{ marginLeft: "1rem" }}
              onClick={handleDownloadAsExcel}
            >
              Download as Excel
            </Button>
          </Box>
        </Card>
      </Box>
    </Box>
  )
}

export default AdminDashboard
