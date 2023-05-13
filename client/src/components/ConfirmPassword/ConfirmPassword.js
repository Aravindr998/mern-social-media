import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material"
import axios from "../../axios"
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

const ConfirmPassword = () => {
  const navigate = useNavigate()
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [confirmPasswordError, setConfirmPasswordError] = useState("")
  const token = localStorage.getItem("tempToken")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setPasswordError("")
    setConfirmPasswordError("")
    try {
      if (!password.trim().length) {
        setPasswordError("Enter a valid password")
        return
      }
      if (!confirmPassword.trim().length) {
        setConfirmPasswordError("Enter a valid password")
        return
      }
      if (password !== confirmPassword) {
        setPasswordError("Password do not match")
        return
      }
      await axios.patch(
        "/api/user/password",
        { password, confirmPassword },
        { headers: { Authorization: token } }
      )
      localStorage.removeItem("tempToken")
      navigate("/login")
    } catch (error) {
      const { response } = error
      if (response) {
        if (response.status === 400) {
          if (response.data.password) {
            setPasswordError(response.data.password)
          } else if (response.data.confirmPassword) {
            setConfirmPassword(response.data.confirmPassword)
          }
        }
      }
      console.log(error)
    }
  }
  return (
    <Container component={"main"} maxWidth="sm">
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
          Enter New Password
        </Typography>
        <Box
          component={"form"}
          sx={{ width: "100%" }}
          noValidate
          onSubmit={handleSubmit}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="password"
                color="primary"
                variant="filled"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setPasswordError("")
                }}
                error={!!passwordError}
                helperText={passwordError}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confrimPassword"
                autoComplete="password"
                color="primary"
                variant="filled"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value)
                  setConfirmPasswordError("")
                }}
                error={!!confirmPasswordError}
                helperText={confirmPasswordError}
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
            Submit
          </Button>
        </Box>
      </Box>
    </Container>
  )
}

export default ConfirmPassword
