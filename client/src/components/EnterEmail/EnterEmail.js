import React, { useState } from "react"
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material"
import axios from "../../axios"
import { useNavigate } from "react-router-dom"

const EnterEmail = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [emailError, setEmailError] = useState("")
  const handleChange = (e) => {
    setEmailError("")
    setEmail(e.target.value)
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    setEmailError("")
    if (!email.trim()) setEmailError("Email cannot be empty")
    try {
      const { data } = await axios.get(`/api/email/identify?email=${email}`)
      navigate(`/login/email/otp/${data.id}`)
    } catch (error) {
      const { response } = error
      if (response.status === 400) {
        setEmailError(response.data.email)
      }
      console.log(error)
    }
  }
  return (
    <Container component="main" maxWidth="sm">
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
          Enter Email
        </Typography>
        <Box
          component="form"
          sx={{ width: "100%" }}
          onSubmit={handleSubmit}
          noValidate
        >
          <Grid container spacing={2}>
            <Grid item xs={12}></Grid>
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
                value={email}
                onChange={handleChange}
                error={!!emailError}
                helperText={emailError}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                fullWidth
                type="submit"
                size="large"
                sx={{ marginBlock: "1rem" }}
              >
                Confirm
              </Button>
              <Button variant="outlined" fullWidth type="submit" size="large">
                Cancel
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  )
}

export default EnterEmail
