import { Box, Button, Card, Fab, Grid, TextField } from "@mui/material"
import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import axios from "../../axios"
import { setUser } from "../../features/users/userSlice"
import EditIcon from "@mui/icons-material/Edit"
import SidePopup from "../SidePopup/SidePopup"

const EditProfile = () => {
  const user = useSelector((state) => state.user)
  const auth = useSelector((state) => state.auth)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [profilePicture, setProfilePicture] = useState("/images/user.png")
  const [coverPicture, setCoverPicture] = useState("/images/cover-picture.png")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [location, setLocation] = useState("")
  const [date, setDate] = useState("")
  const [success, setSuccess] = useState(false)

  const [error, setError] = useState(false)
  const [firstNameError, setFirstNameError] = useState("")
  const [lastNameError, setLastNameError] = useState("")
  const [usernameError, setUsernameError] = useState("")
  const [emailError, setEmailError] = useState("")
  const [dateError, setDateError] = useState("")

  const [edit, setEdit] = useState(true)

  const profileRef = useRef()
  const coverRef = useRef()
  useEffect(() => {
    if (user?.profilePicture) setProfilePicture(user.profilePicture)
    if (user?.coverPicture) setCoverPicture(user.coverPicture)
    if (user?.firstName) setFirstName(user.firstName)
    if (user?.lastName) setLastName(user.lastName)
    if (user?.username) setUsername(user.username)
    if (user?.email) setEmail(user.email)
    if (user?.location) setLocation(user.location)
    if (user?.dob) {
      const date = new Date(user.dob)
      const dateString = date.toISOString().split("T")[0]
      setDate(dateString)
    }
  }, [user])
  const changeCoverPicture = (e) => {
    if (e.target.files[0])
      setCoverPicture(URL.createObjectURL(e.target.files[0]))
  }
  const changeProfilePicture = (e) => {
    if (e.target.files[0])
      setProfilePicture(URL.createObjectURL(e.target.files[0]))
  }
  const handleSubmit = async () => {
    try {
      setSuccess(false)
      setEdit(false)
      setError(false)
      const formData = new FormData()
      formData.append("firstName", firstName)
      formData.append("lastName", lastName)
      formData.append("username", username)
      formData.append("email", email)
      formData.append("location", location)
      formData.append("date", date)
      if (profileRef.current.files.length) {
        formData.append(
          "profilePicture",
          profileRef.current.files[0],
          profileRef.current.files[0].name
        )
      }
      if (coverRef.current.files.length) {
        formData.append(
          "coverPicture",
          coverRef.current.files[0],
          coverRef.current.files[0].name
        )
      }
      const { data } = await axios.patch("/api/user/edit", formData, {
        headers: { Authorization: auth, "Content-Type": "multipart/form-data" },
      })
      dispatch(setUser(data))
      setSuccess(true)
      setEdit(true)
      setError(false)
    } catch (error) {
      const { response } = error
      if (response) {
        if (response.status === 400) {
          const { data } = response
          if (data.firstName) setFirstNameError(data.firstName)
          if (data.lastName) setLastNameError(data.lastName)
          if (data.username) setUsernameError(data.username)
          if (data.email) setEmailError(data.email)
          if (data.dob) setDateError(data.dob)
        }
      }
      console.log(error)
      setError(true)
    }
  }
  const handleEdit = () => {
    setError(false)
    setSuccess(false)
    setEdit(false)
  }
  return (
    <Card
      sx={{
        width: "100%",
        height: "82vh",
        overflowY: "auto",
      }}
    >
      <Fab
        color="info"
        aria-label="edit"
        sx={{ position: "fixed", top: 120, right: 50 }}
        onClick={handleEdit}
      >
        <EditIcon />
      </Fab>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Box sx={{ width: "70%", position: "relative", marginTop: "2%" }}>
          <Box
            sx={{
              width: "100%",
              height: "13rem",
              borderRadius: "1rem",
              backgroundImage: `url(${coverPicture})`,
              backgroundSize: "cover",
            }}
          >
            <Button
              sx={{ width: "100%", height: "100%" }}
              component="label"
              disabled={edit}
            >
              <input
                type="file"
                hidden
                onChange={changeCoverPicture}
                ref={coverRef}
              />
            </Button>
          </Box>
          <Box
            sx={{
              height: "12rem",
              width: "12rem",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%)",
              backgroundImage: `url(${profilePicture})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "50%, 50%",
              borderRadius: "100%",
            }}
          >
            <Button
              sx={{
                width: "100%",
                height: "100%",
                zIndex: "10",
                borderRadius: "100%",
              }}
              component="label"
              disabled={edit}
            >
              <input
                type="file"
                hidden
                onChange={changeProfilePicture}
                ref={profileRef}
                disabled={edit}
              />
            </Button>
          </Box>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "8rem",
        }}
      >
        <Grid container>
          <Grid item xs={12} sm={4} sx={{ padding: "1rem" }}>
            <TextField
              fullWidth
              variant="filled"
              label="First Name"
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value)
                setFirstNameError("")
              }}
              error={!!firstNameError}
              helperText={firstNameError}
              disabled={edit}
            />
          </Grid>
          <Grid item xs={12} sm={4} sx={{ padding: "1rem" }}>
            <TextField
              fullWidth
              variant="filled"
              label="Last Name"
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value)
                setLastNameError("")
              }}
              error={!!lastNameError}
              helperText={lastNameError}
              disabled={edit}
            />
          </Grid>
          <Grid item xs={12} sm={4} sx={{ padding: "1rem" }}>
            <TextField
              fullWidth
              variant="filled"
              label="Username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value)
                setUsernameError("")
              }}
              error={!!usernameError}
              helperText={usernameError}
              disabled={edit}
            />
          </Grid>
          <Grid item xs={12} sm={4} sx={{ padding: "1rem" }}>
            <TextField
              fullWidth
              variant="filled"
              label="Email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setEmailError("")
              }}
              error={!!emailError}
              helperText={emailError}
              disabled={edit}
            />
          </Grid>
          <Grid item xs={12} sm={4} sx={{ padding: "1rem" }}>
            <TextField
              fullWidth
              variant="filled"
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              disabled={edit}
            />
          </Grid>
          <Grid item xs={12} sm={4} sx={{ padding: "1rem" }}>
            <TextField
              fullWidth
              variant="filled"
              label="Date of birth"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={date}
              onChange={(e) => {
                setDate(e.target.value)
                setDateError("")
              }}
              error={!!dateError}
              helperText={dateError}
              disabled={edit}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sx={{
              padding: "1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "end",
            }}
            gap={2}
          >
            <Button
              variant="outlined"
              color="error"
              onClick={() => navigate(`/profile/${user?.username}`)}
            >
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSubmit} disabled={edit}>
              Save
            </Button>
          </Grid>
        </Grid>
      </Box>
      <SidePopup message="Saved successfully" type="success" show={success} />
      <SidePopup
        message="Something went wrong, please try again later"
        type="error"
        show={error}
      />
    </Card>
  )
}

export default EditProfile
