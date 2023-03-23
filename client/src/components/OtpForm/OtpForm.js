import React, { useEffect, useRef, useState } from "react"
import CssBaseline from "@mui/material/CssBaseline"
import TextField from "@mui/material/TextField"
import Grid from "@mui/material/Grid"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import Container from "@mui/material/Container"
import { Alert, Button, CircularProgress, Slide } from "@mui/material"
import { useNavigate } from "react-router-dom"
import axios from "../../axios"
import { useDispatch, useSelector } from "react-redux"
import { TOKEN_KEY } from "../../constants/constant"
import { setAuth } from "../../features/users/authSlice"

function OtpForm() {
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user)
  const containerRef = useRef()
  const navigate = useNavigate()
  const [otp, setOtp] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [validate, setValidate] = useState("")
  const [loading, setLoading] = useState(false)
  const [send, setSend] = useState("SEND OTP")
  const authToken = useSelector((state) => state.auth)
  useEffect(() => {
    console.log(user)
    if (!user) {
      return navigate("/login")
    }
    if (user.isVerified) {
      return navigate("/login")
    }
    // axios.get(`/api/register/otp/resend?id=${user._id}`, {
    //   headers: { Authorization: authToken },
    // })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleOtp = () => {
    setSend("RESEND OTP")
    axios
      .get(`/api/register/otp/resend?id=${user._id}`, {
        headers: { Authorization: authToken },
      })
      .then(({ data }) => {
        if (data.verified) {
          return navigate("/")
        }
        if (data.success) {
          setSuccess(true)
        } else {
          setError("Something went wrong. Please try again later")
        }
      })
  }

  const handleSubmit = (event) => {
    setSuccess(false)
    event.preventDefault()
    if (!otp) {
      setValidate("Please enter a valid otp")
      return
    }
    if (!/^\d{6}$/.test(otp)) {
      setValidate("Please enter a valid otp")
      return
    }
    setLoading(true)
    if (!loading) {
      setError("")
      axios
        .patch(
          `/api/register/otp?id=${user._id}`,
          { otp },
          {
            headers: {
              Authorization: authToken,
              "Content-Type": "application/json",
            },
          }
        )
        .then(({ data }) => {
          setLoading(false)
          if (data.verified) {
            return navigate("/")
          }
          if (data.success) {
            localStorage.setItem(TOKEN_KEY, `Bearer ${data.token}`)
            dispatch(setAuth())
            return navigate("/details/add")
          } else {
            setError("Wrong OTP")
          }
        })
        .catch((error) => {
          setLoading(false)
          console.log(error)
          if (error?.response?.status === 500) {
            setError("Something went wrong. Please try again later")
          }
        })
    }
  }
  const handleChange = (event) => {
    setValidate("")
    setOtp(event.target.value)
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
          Verify Your Number
        </Typography>
        <Box
          component="form"
          sx={{ width: "100%" }}
          onSubmit={handleSubmit}
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
              <Button size="small" variant="text" onClick={handleOtp}>
                {send}
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
            {loading ? (
              <CircularProgress sx={{ color: "white" }} size="1.7rem" />
            ) : (
              "Submit"
            )}
          </Button>
        </Box>
      </Box>
    </Container>
  )
}

export default OtpForm
