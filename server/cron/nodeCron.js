import cron from "node-cron"
import Stripe from "stripe"
import paymentModel from "../model/Payment.js"
import userModel from "../model/User.js"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

cron.schedule("0 */10 * * * *", async () => {
  try {
    console.log("checking")
    const payment = await paymentModel.find({
      refundId: { $exists: false },
      isDeleted: false,
    })
    for (let item of payment) {
      const subscription = await stripe.subscriptions.retrieve(
        item.subscriptionId
      )
      const date = new Date(0)
      date.setUTCSeconds(subscription.current_period_end)
      if (
        subscription.status === "past_due" ||
        (subscription.status === "canceled" && date < new Date())
      ) {
        const userId = item.userId
        const user = await userModel.findById(userId)
        user.elite = false
        user.subscriptionStatus = "inactive"
        delete user.eliteVerified
        await user.save()
      }
    }
  } catch (error) {
    console.log(error)
  }
})
