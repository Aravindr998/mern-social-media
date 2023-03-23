import React, { useRef, useState } from "react"
import CssBaseline from "@mui/material/CssBaseline"
import TextField from "@mui/material/TextField"
import Link from "@mui/material/Link"
import Grid from "@mui/material/Grid"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Container from "@mui/material/Container"
import { Alert, Button, CircularProgress, Slide } from "@mui/material"
import GoogleIcon from "@mui/icons-material/Google"
import { Link as RouterLink, useNavigate } from "react-router-dom"
import axios from "../../axios"
import { setUser } from "../../features/users/userSlice"
import { useDispatch } from "react-redux"

function SignupForm() {
  const dispatch = useDispatch()
  const containerRef = useRef()
  const navigate = useNavigate()
  const [users, setUsers] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
  })
  const [error, setError] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    others: "",
  })
  const [loading, setLoading] = useState(false)
  const handleSubmit = (event) => {
    event.preventDefault()
    setLoading(true)
    if (!loading) {
      setError((prevState) => {
        return {
          ...prevState,
          others: "",
        }
      })
      axios
        .post("/api/register", { ...users })
        .then(({ data }) => {
          setLoading(false)
          if (data.success) {
            dispatch(setUser(data.user))
            console.log(data.user)
            navigate("/signup/otp")
          }
        })
        .catch((error) => {
          setLoading(false)
          console.log(error)
          if (error?.response?.status === 400) {
            const { data } = error?.response
            setError((prevState) => {
              return {
                ...prevState,
                ...data,
              }
            })
          }
          if (error?.response?.status === 409) {
            setError((prevState) => {
              return {
                ...prevState,
                others: error.response.data.message,
              }
            })
          }
        })
    }
  }
  const handleChange = (event) => {
    setError((prevState) => {
      const { name } = event.target
      return {
        ...prevState,
        [name]: "",
      }
    })
    setUsers((prevState) => {
      const { name } = event.target
      return {
        ...prevState,
        [name]: event.target.value,
      }
    })
  }

  return (
    <Container component="main" maxWidth="sm">
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          component="h1"
          variant="h5"
          sx={{ fontWeight: "700", fontSize: "2rem" }}
        >
          Register
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} ref={containerRef}>
              {error.others && (
                <Slide
                  direction="up"
                  in={!!error.others}
                  container={containerRef.current}
                >
                  <Alert
                    variant="filled"
                    severity="error"
                    sx={{ mt: 1 }}
                    fullWidth
                  >
                    {error.others}
                  </Alert>
                </Slide>
              )}
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="firstName"
                label="First Name"
                name="firstName"
                autoComplete="name"
                autoFocus
                color="primary"
                variant="filled"
                value={users.firstName}
                onChange={handleChange}
                error={!!error.firstName}
                helperText={error.firstName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="name"
                color="primary"
                variant="filled"
                value={users.lastName}
                onChange={handleChange}
                error={!!error.lastName}
                helperText={error.lastName}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                required
                fullWidth
                name="username"
                label="Username"
                type="text"
                id="username"
                autoComplete="username"
                color="primary"
                variant="filled"
                value={users.username}
                onChange={handleChange}
                error={!!error.username}
                helperText={error.username}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="dob"
                label="Date of birth"
                name="dob"
                color="primary"
                variant="filled"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={users.dob}
                onChange={handleChange}
                error={!!error.dob}
                helperText={error.dob}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="phone"
                label="Phone"
                name="phone"
                color="primary"
                variant="filled"
                type="text"
                value={users.phone}
                onChange={handleChange}
                error={!!error.phone}
                helperText={error.phone}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                required
                fullWidth
                name="email"
                label="Email"
                type="email"
                id="email"
                autoComplete="email"
                color="primary"
                variant="filled"
                value={users.email}
                onChange={handleChange}
                error={!!error.email}
                helperText={error.email}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                color="primary"
                variant="filled"
                value={users.password}
                onChange={handleChange}
                error={!!error.password}
                helperText={error.password}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                autoComplete="current-password"
                color="primary"
                variant="filled"
                value={users.confirmPassword}
                onChange={handleChange}
                error={!!error.confirmPassword}
                helperText={error.confirmPassword}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            size="large"
          >
            {loading ? (
              <CircularProgress sx={{ color: "white" }} size="1.7rem" />
            ) : (
              "Login"
            )}
          </Button>
          <Button
            type="button"
            fullWidth
            variant="outlined"
            sx={{ mb: 2 }}
            size="large"
            startIcon={<GoogleIcon />}
          >
            Sign Up With Google
          </Button>
          <Grid container sx={{ justifyContent: "center", mt: 5 }}>
            <Grid item>
              <Link
                href="#"
                variant="body2"
                sx={{ fontWeight: "500" }}
                component={RouterLink}
                to="/login"
              >
                {"Already have an account? Login"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  )
}

export default SignupForm
