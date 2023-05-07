import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  CssBaseline,
  Grid,
  Slide,
  Stack,
  Typography,
} from "@mui/material"
import React, { useState } from "react"
import Navbar from "../components/Navbar/Navbar"
import VerifiedIcon from "@mui/icons-material/Verified"
import { useTheme } from "@emotion/react"
import { useSelector } from "react-redux"
import SidePanel from "../components/SidePanel/SidePanel"
import ActivePanel from "../components/ActivePanel/ActivePanel"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import { STRIPE_PUBLISHABLE_KEY } from "../constants/constant"
import Checkout from "../components/Checkout/Checkout"

const ElitePlansPage = () => {
  const [show, setShow] = useState(false)
  const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY)
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
              <Typography fontWeight={500}>
                Verfied Checkmark on profile
              </Typography>
              <Typography fontWeight={500}>Priority Support</Typography>
            </Stack>
          </Box>
          <Box marginY={"1rem"}>
            <Elements stripe={stripePromise}>
              <Checkout />
            </Elements>
          </Box>
        </Card>
      </Container>
    </>
  )
}

export default ElitePlansPage
