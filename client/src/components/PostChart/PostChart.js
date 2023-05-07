import React, { useEffect, useState } from "react"
import {
  Box,
  Card,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material"
import { Line } from "react-chartjs-2"
import { Chart as ChartJS } from "chart.js/auto"
import axios from "../../axios"
import { useDispatch, useSelector } from "react-redux"
import { setDate } from "../../features/adminDashboard/adminDashboardSlice"

const PostChart = () => {
  const [data, setData] = useState([])
  const date = useSelector((state) => state.adminDashboard)
  const adminAuth = useSelector((state) => state.adminAuth)
  const dispatch = useDispatch()

  useEffect(() => {
    ;(async () => {
      const { data } = await axios.get("/api/admin/postdata", {
        headers: { Authorization: adminAuth },
      })
      setData(data)
    })()
  }, [])

  const dataset = {
    labels: data.map((item) => item._id),
    datasets: [
      {
        label: "Posts per day",
        data: data.map((item) => item.count),
        backgroundColor: ["#940000"],
        borderColor: ["#940000"],
      },
    ],
  }

  const handleChange = async (e) => {
    dispatch(setDate(e.target.value))
    try {
      const { data } = await axios.get(
        `/api/admin/postdata?month=${e.target.value}`,
        {
          headers: { Authorization: adminAuth },
        }
      )
      setData(data)
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <Card
      sx={{
        padding: "1rem",
        marginTop: "1rem",
      }}
    >
      <Box display={"flex"} justifyContent={"flex-end"}>
        <FormControl sx={{ width: "8rem" }}>
          <InputLabel id="date-select">Month</InputLabel>
          <Select
            labelId="date-select"
            id="data"
            value={date}
            label="Month"
            onChange={handleChange}
            variant="standard"
          >
            <MenuItem value={0}>Jan</MenuItem>
            <MenuItem value={1}>Feb</MenuItem>
            <MenuItem value={2}>Mar</MenuItem>
            <MenuItem value={3}>Apr</MenuItem>
            <MenuItem value={4}>May</MenuItem>
            <MenuItem value={5}>June</MenuItem>
            <MenuItem value={6}>July</MenuItem>
            <MenuItem value={7}>Aug</MenuItem>
            <MenuItem value={8}>Sep</MenuItem>
            <MenuItem value={9}>Oct</MenuItem>
            <MenuItem value={10}>Nov</MenuItem>
            <MenuItem value={11}>Dec</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Line data={dataset} />
    </Card>
  )
}

export default PostChart
