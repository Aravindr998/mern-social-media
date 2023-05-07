import React from "react"
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { useSelector } from "react-redux"
import axios from "../../axios"
import { Button, Card } from "@mui/material"

const Checkout = () => {
  const user = useSelector((state) => state.user)
  const auth = useSelector((state) => state.auth)
  const stripe = useStripe()
  const elements = useElements()
  const createSubscription = async () => {
    try {
      const paymentMethod = await stripe?.createPaymentMethod({
        type: "card",
        card: elements?.getElement(CardElement),
        billing_details: {
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
        },
      })
      console.log(paymentMethod)
      const { data } = await axios.post(
        "/api/payment/subscription",
        { paymentMethod: paymentMethod?.paymentMethod?.id },
        { headers: { Authorization: auth } }
      )
      const confirmPayment = await stripe?.confirmCardPayment(data.clientSecret)
      if (confirmPayment?.error) {
        alert(confirmPayment.error.message)
      } else {
        alert("Success")
      }
    } catch (error) {
      console.log(error)
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
          Subscribe
        </Button>
      </Card>
    </>
  )
}

export default Checkout
