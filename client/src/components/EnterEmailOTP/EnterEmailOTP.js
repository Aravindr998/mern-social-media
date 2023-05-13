import React, { useRef, useState } from "react"
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Slide,
  TextField,
  Typography,
} from "@mui/material"
import { useNavigate, useParams } from "react-router-dom"
import axios from "../../axios"
import { useDispatch, useSelector } from "react-redux"
import { setTempAuth } from "../../features/tempAuth/tempAuth"

const EnterEmailOTP = () => {
  const containerRef = useRef()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const tempAuth = useSelector((state) => state.tempAuth)
  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [validate, setValidate] = useState("")
  const [loading, setLoading] = useState(false)

  const { userId } = useParams()

  const handleResend = async () => {
    if (!loading) {
      setLoading(true)
      setSuccess(false)
      setError("")
      setValidate("")
      try {
        await axios.get(`/api/email/otp/resend?userId=${userId}`)
        setLoading(false)
        setSuccess(true)
      } catch (error) {
        setLoading(false)
        const { response } = error
        if (response.status === 401) {
          setError(response.data.message)
        }
        console.log(error)
      }
    }
  }
  const handleChange = (e) => {
    setError("")
    setSuccess(false)
    setValidate("")
    setOtp(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setValidate("")
    setSuccess(false)
    try {
      if (!otp.trim().length) {
        setValidate("Enter a valid OTP")
        return
      }
      const { data } = await axios.patch(`/api/email/otp/verify`, {
        otp,
        userId,
      })
      localStorage.setItem("tempToken", `Bearer ${data.token}`)
      navigate("/login/password/confirm")
    } catch (error) {
      const { response } = error
      if (response.status === 401) {
        setError(response.data.message)
      } else if (response.status === 400) {
        setError("Invalid OTP")
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
          Verify your email
        </Typography>
        <Box
          onSubmit={handleSubmit}
          component="form"
          sx={{ width: "100%" }}
          noValidate
        >
          <Grid container spacing={2}>
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
              {success && (
                <Slide
                  direction="up"
                  in={success}
                  container={containerRef.current}
                >
                  <Alert variant="filled" severity="success" sx={{ mt: 1 }}>
                    OTP sent
                  </Alert>
                </Slide>
              )}
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="normal"
                required
                fullWidth
                name="otp"
                label="OTP"
                type="otp"
                id="otp"
                autoComplete="otp"
                color="primary"
                variant="filled"
                value={otp}
                onChange={handleChange}
                error={!!validate}
                helperText={validate}
              />
            </Grid>
            <Grid item>
              <Button size="small" variant="text" onClick={handleResend}>
                {loading ? <CircularProgress size="1rem" /> : "Resend OTP"}
              </Button>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            size="large"
          >
            {/* {loading ? (
              <CircularProgress sx={{ color: "white" }} size="1.7rem" />
            ) : (
              "Submit"
            )} */}
            Submit
          </Button>
        </Box>
      </Box>
    </Container>
  )
}

export default EnterEmailOTP
