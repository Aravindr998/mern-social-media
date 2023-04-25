import React, { useRef, useState } from "react"
import CssBaseline from "@mui/material/CssBaseline"
import TextField from "@mui/material/TextField"
import Link from "@mui/material/Link"
import Grid from "@mui/material/Grid"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Container from "@mui/material/Container"
import { Alert, Button, Slide } from "@mui/material"
import { useNavigate } from "react-router-dom"
import axios from "../../axios"
import { ADMIN_TOKEN_KEY } from "../../constants/constant"
import { useDispatch } from "react-redux"
import { setAdminAuth } from "../../features/adminAuth/adminAuthSlice"

const AdminLogin = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const containerRef = useRef()
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  })
  const [validate, setValidate] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const handleSubmit = (event) => {
    setError("")
    event.preventDefault()
    axios
      .post("/api/admin/login", credentials)
      .then(({ data }) => {
        if (data.success) {
          localStorage.setItem(ADMIN_TOKEN_KEY, `Bearer ${data.token}`)
          dispatch(setAdminAuth())
          navigate("/admin/dashboard")
        }
      })
      .catch(({ response }) => {
        if (response.status === 401) {
          setError(response.data.message)
        } else if (response.status === 400) {
          setValidate((prevState) => {
            return {
              ...prevState,
              ...response.data,
            }
          })
        } else {
          setError("Something went wrong, Please try again later")
        }
      })
  }
  const handleChange = (event) => {
    const { name } = event.target
    setValidate((prevState) => {
      return {
        ...prevState,
        [name]: "",
      }
    })
    setCredentials((prevState) => {
      return {
        ...prevState,
        [name]: event.target.value,
      }
    })
  }

  return (
    <Container component="main" maxWidth="xs">
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
          Login
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
          <Grid container>
            <Grid item xs={12} ref={containerRef}>
              {error && (
                <Slide
                  direction="up"
                  in={error}
                  container={containerRef.current}
                >
                  <Alert variant="filled" severity="error" sx={{ mt: 1 }}>
                    {error}
                  </Alert>
                </Slide>
              )}
            </Grid>
          </Grid>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            color="primary"
            variant="filled"
            value={credentials.email}
            onChange={handleChange}
            error={!!validate.email}
            helperText={validate.email}
          />
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
            value={credentials.password}
            onChange={handleChange}
            error={!!validate.password}
            helperText={validate.password}
          />
          <Grid item xs>
            <Link href="#" variant="body2" sx={{ fontWeight: "500" }}>
              Forgot password?
            </Link>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            size="large"
          >
            Login
          </Button>
        </Box>
      </Box>
    </Container>
  )
}

export default AdminLogin
