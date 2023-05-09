import React, { useState } from "react"
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { useDispatch, useSelector } from "react-redux"
import axios from "../../axios"
import {
  Button,
  Card,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material"
import { setUser } from "../../features/users/userSlice"

const Checkout = () => {
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const user = useSelector((state) => state.user)
  const auth = useSelector((state) => state.auth)
  const stripe = useStripe()
  const elements = useElements()
  const dispatch = useDispatch()

  const handleSuccessOpen = () => {
    setTitle("Payment Successful")
    setContent(
      "Your payment is successful. You will be recieve Vibee Elite once your account is verified."
    )
    setOpen(true)
  }

  const handleFailureOpen = () => {
    setTitle("Payment Failed")
    setContent(
      "Your payment didn't go through. If amount was debited from your account, it will be credited back within 7 working days"
    )
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const createSubscription = async () => {
    try {
      if (!loading) {
        setLoading(true)
        const paymentMethod = await stripe?.createPaymentMethod({
          type: "card",
          card: elements?.getElement(CardElement),
          billing_details: {
            name: `${user.firstName} ${user.lastName}`,
            email: user.email,
          },
        })
        if (!paymentMethod || paymentMethod.error) {
          // handle error
          setLoading(false)
          return
        }
        console.log(paymentMethod)
        const { data } = await axios.post(
          "/api/payment/subscription",
          { paymentMethod: paymentMethod?.paymentMethod?.id },
          { headers: { Authorization: auth } }
        )
        const confirmPayment = await stripe?.confirmCardPayment(
          data.clientSecret
        )
        if (confirmPayment?.error) {
          alert(confirmPayment.error.message)
          setLoading(false)
          handleFailureOpen()
        } else {
          const response = await axios.get(
            `/api/payment/subscription/status/${confirmPayment.paymentIntent.id}`,
            { headers: { Authorization: auth } }
          )
          console.log(response)
          console.log(confirmPayment)
          const user = await axios.get("/api/user/details", {
            headers: { Authorization: auth },
          })
          dispatch(setUser(user))
          handleSuccessOpen()
          setLoading(false)
        }
      }
    } catch (error) {
      console.log(error)
      handleFailureOpen()
      setLoading(false)
    }
  }
  return (
    <>
      <Card sx={{ padding: "1rem", backgroundColor: "white" }}>
        <CardElement />
        <Button
          variant="contained"
          fullWidth
          onClick={createSubscription}
          disabled={!stripe}
          sx={{ marginTop: "3rem" }}
        >
          {loading ? (
            <CircularProgress sx={{ color: "white" }} size="1.7rem" />
          ) : (
            "Subscribe"
          )}
        </Button>
      </Card>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} autoFocus>
            Okay
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default Checkout
