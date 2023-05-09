import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Slide,
  Stack,
  Typography,
} from "@mui/material"
import React, { useEffect, useState } from "react"
import Navbar from "../components/Navbar/Navbar"
import VerifiedIcon from "@mui/icons-material/Verified"
import { useTheme } from "@emotion/react"
import { useDispatch, useSelector } from "react-redux"
import SidePanel from "../components/SidePanel/SidePanel"
import ActivePanel from "../components/ActivePanel/ActivePanel"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import { STRIPE_PUBLISHABLE_KEY } from "../constants/constant"
import Checkout from "../components/Checkout/Checkout"
import axios from "../axios"
import { setUser } from "../features/users/userSlice"

const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY)
const ElitePlansPage = () => {
  const [show, setShow] = useState(false)
  const [sub, setSub] = useState({})
  const user = useSelector((state) => state.user)
  const auth = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  useEffect(() => {
    ;(async () => {
      try {
        const { data } = await axios.get("/api/payment/subscription/details", {
          headers: { Authorization: auth },
        })
        setSub(data)
      } catch (error) {
        console.log(error)
      }
    })()
  }, [user])

  const handleClose = () => {
    setShow(false)
  }
  const handleCancelSubscription = async () => {
    try {
      const { data } = await axios.patch(
        "/api/payment/subscription/cancel",
        { paymentId: sub._id },
        { headers: { Authorization: auth } }
      )
      setSub(data)
    } catch (error) {
      console.log(error)
    }
  }
  let elite = (
    <Card sx={{ width: { xs: "100%", lg: "50%" }, padding: "1rem" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? theme.palette.grey[200]
              : theme.palette.grey[700],
          padding: "1rem",
          borderRadius: "1rem",
        }}
      >
        <Typography fontSize={"2rem"} fontWeight={500}>
          VIBEE ELITE
        </Typography>
        <VerifiedIcon fontSize="large" />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Typography fontSize={"1.5rem"}>
          <Typography component={"span"} fontSize={"2rem"} fontWeight={700}>
            $8
          </Typography>
          /month
        </Typography>
      </Box>
      <Box textAlign={"center"}>
        <Typography fontSize={"1.5rem"} fontWeight={500}>
          Perks
        </Typography>
        <Stack spacing={2} sx={{ margin: "1rem" }}>
          <Typography fontWeight={500}>Verfied Checkmark on profile</Typography>
          <Typography fontWeight={500}>Priority Support</Typography>
        </Stack>
      </Box>
      <Box marginY={"1rem"}>
        <Elements stripe={stripePromise}>
          <Checkout />
        </Elements>
      </Box>
    </Card>
  )
  if (user?.eliteVerified === "pending") {
    elite = (
      <Card sx={{ padding: "1rem", width: { xs: "90%", lg: "50%" } }}>
        <Box>
          <Typography fontSize={"1.5rem"} fontWeight={500} textAlign={"center"}>
            Your subscription status is pending verification
          </Typography>
          <Typography textAlign={"center"}>
            Once your account gets verified your subscription will be active
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "20rem",
          }}
        >
          <Box component={"img"} src="/images/delay.png" width={"10rem"}></Box>
        </Box>
      </Card>
    )
  } else if (user?.eliteVerified === "rejected") {
    elite = (
      <Card sx={{ padding: "1rem", width: { xs: "90%", lg: "50%" } }}>
        <Box>
          <Typography fontSize={"1.5rem"} fontWeight={500} textAlign={"center"}>
            Your subscription is rejected!
          </Typography>
          <Typography textAlign={"center"}>
            Your account is not eligible for verification.
          </Typography>
          <Typography textAlign={"center"}>
            The subscription amount is refunded to your payment method.
          </Typography>
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "20rem",
          }}
        >
          <Box
            component={"img"}
            src="/images/warning.png"
            width={"10rem"}
          ></Box>
        </Box>
      </Card>
    )
  } else if (user?.eliteVerified === "verified") {
    elite = (
      <Card sx={{ padding: "1rem", width: { xs: "90%", lg: "50%" } }}>
        <Box>
          <Typography fontSize={"1.5rem"} fontWeight={500} textAlign={"center"}>
            Your subscription is Active!
          </Typography>
          {sub.status === "active" ? (
            <Typography textAlign={"center"}>
              Your subscription renews in
              <Typography component={"span"} fontWeight={500}>
                {new Date(sub?.endDate).toString().slice(3, 16)}
              </Typography>
            </Typography>
          ) : (
            <Typography textAlign={"center"}>
              Your subscription status for next month is
              <Typography component={"span"} fontWeight={500}>
                {` ${sub.status}`}
              </Typography>
            </Typography>
          )}
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "20rem",
          }}
        >
          <Box
            component={"img"}
            src="/images/verified.png"
            width={"10rem"}
          ></Box>
        </Box>
        {sub.status === "active" && (
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button onClick={() => setShow(true)}>Cancel Subscription</Button>
          </Box>
        )}
      </Card>
    )
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
          // paddingLeft: { xs: "2rem ", lg: "18rem !important" },
          // paddingRight: { xs: "2rem ", lg: "18rem !important" },
        }}
      >
        {elite}
      </Container>
      <Dialog
        open={show}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Cancel Elite Subscription?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            If you cancel the subscription, you won't be charged for the next
            month. You will still have Elite perks for the current month
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="text" color="primary">
            Close
          </Button>
          <Button
            onClick={handleCancelSubscription}
            autoFocus
            variant="text"
            color="warning"
          >
            Cancel Subscription
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ElitePlansPage
