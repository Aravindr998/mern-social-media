import Stripe from "stripe"
import userModel from "../model/User.js"
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const initiatePayment = async (req, res) => {
  try {
    const { id } = req.user
    const user = await userModel.findById(id)
    const { paymentMethod } = req.body
    const customer = await stripe.customers.create({
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      payment_method: paymentMethod,
      invoice_settings: {
        default_payment_method: paymentMethod,
      },
    })

    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: process.env.STRIPE_PRICE_ID }],
      payment_settings: {
        payment_method_options: {
          card: {
            request_three_d_secure: "any",
          },
        },
        payment_method_types: ["card"],
        save_default_payment_method: "on_subscription",
      },
      expand: ["latest_invoice.payment_intent"],
    })
    console.log(subscription.latest_invoice.payment_intent.client_secret)
    console.log(subscription)
    res.json({
      clientSecret: subscription.latest_invoice.payment_intent.client_secret,
    })
  } catch (error) {
    console.log(error)
  }
}
