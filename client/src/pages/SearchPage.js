import {
  Avatar,
  Box,
  Button,
  Card,
  Checkbox,
  Container,
  CssBaseline,
  Divider,
  FormControlLabel,
  Stack,
  TextField,
  Typography,
} from "@mui/material"
import React, { useEffect, useState } from "react"
import SidePanel from "../components/SidePanel/SidePanel"
import ActivePanel from "../components/ActivePanel/ActivePanel"
import Navbar from "../components/Navbar/Navbar"
import { useNavigate, useSearchParams } from "react-router-dom"
import axios from "../axios"
import { useSelector } from "react-redux"
import { useTheme } from "@emotion/react"

const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const key = searchParams.get("key")
  const auth = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const [search, setSearch] = useState(key || "")
  const [user, setUser] = useState([])
  const [friends, setFriends] = useState(false)
  const [count, setCount] = useState(0)
  const [show, setShow] = useState(false)
  const [pageNumber, setPageNumber] = useState(1)
  const theme = useTheme()
  const backgroundColor = theme.palette.mode === "dark" ? "#4e4f4f" : "#DFDFDF"

  useEffect(() => {
    if (searchParams) {
      axios
        .get(`/api/users/search?key=${search}&filter=${friends}`, {
          headers: { Authorization: auth },
        })
        .then(({ data }) => {
          console.log(data)
          setUser(data.result)
          setCount(data.count)
        })
        .catch((error) => {
          console.log(error)
        })
    }
  }, [searchParams])

  useEffect(() => {
    if (user.length < count) setShow(true)
    else setShow(false)
  }, [count])

  const handleChange = (e) => {
    setSearch(e.target.value)
  }
  const searchUser = async () => {
    setSearchParams({ key: search, filter: friends })
  }

  const handleCheckboxChange = () => {
    setFriends((prevState) => !prevState)
  }

  const handleLoadMore = async () => {
    try {
      const { data } = await axios.get(
        `/api/users/search?key=${search}&filter=${friends}&skip=${pageNumber}`,
        {
          headers: { Authorization: auth },
        }
      )
      setPageNumber((prevState) => prevState++)
      setUser((prevState) => {
        return [...prevState, ...data.result]
      })
      setCount(data.count)
    } catch (error) {
      console.log(error)
    }
  }

  console.log(user)
  let users = (
    <Box textAlign={"center"} padding={"1rem"}>
      <Typography fontWeight={500}>No users matched the search</Typography>
    </Box>
  )
  if (user.length) {
    users = user.map((item) => {
      return (
        <>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              "&:hover": { backgroundColor: backgroundColor },
              borderRadius: "0.5rem",
              transition: "background-color 0.3s",
              cursor: "pointer",
              padding: "1rem",
            }}
            onClick={() => {
              navigate(`/profile/${item.username}`)
            }}
            key={item._id}
          >
            <Avatar src={item.profilePicture} />
            <Typography fontWeight={500} sx={{ marginLeft: "1rem" }}>
              {item.username}
            </Typography>
          </Box>
          <Divider />
        </>
      )
    })
  }

  return (
    <>
      <CssBaseline />
      <Navbar />
      <SidePanel />
      <ActivePanel />
      <Container
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 10,
        }}
      >
        <Card
          sx={{
            width: { xs: "90%", lg: "50%" },
            marginBottom: "1rem",
            position: "relative",
            padding: "1rem",
            height: "85vh",
          }}
        >
          <Box display={"flex"} alignItems={"stretch"}>
            <TextField
              placeholder="Search"
              fullWidth
              sx={{ marginBottom: "1rem" }}
              value={search}
              onChange={handleChange}
            />
            <Button
              variant="contained"
              sx={{ marginBottom: "1rem", marginLeft: "1rem" }}
              onClick={searchUser}
            >
              Search
            </Button>
          </Box>
          <FormControlLabel
            control={
              <Checkbox checked={friends} onChange={handleCheckboxChange} />
            }
            label="Include friends of friends only"
          />
          <Box height={"100%"}>
            <Stack sx={{ overflowY: "auto", height: "85%" }}>
              {users}
              {show && (
                <Box display={"flex"} justifyContent={"flex-end"}>
                  <Button onClick={handleLoadMore}>Load More</Button>
                </Box>
              )}
            </Stack>
          </Box>
        </Card>
      </Container>
    </>
  )
}

export default SearchPage
