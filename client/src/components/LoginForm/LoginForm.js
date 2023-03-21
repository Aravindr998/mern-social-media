import React from "react"
import CssBaseline from "@mui/material/CssBaseline"
import TextField from "@mui/material/TextField"
import Link from "@mui/material/Link"
import Grid from "@mui/material/Grid"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Container from "@mui/material/Container"
import { Button } from "@mui/material"
import GoogleIcon from "@mui/icons-material/Google"
import { Link as RouterLink } from "react-router-dom"

function LoginForm() {
  const handleSubmit = (event) => {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    console.log({
      email: data.get("email"),
      password: data.get("password"),
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
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 5 }}>
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
                to="/signup"
              >
                {"Sign up with email and password"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  )
}

export default LoginForm
