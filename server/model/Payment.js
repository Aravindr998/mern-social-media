import mongoose from "mongoose"

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    subscriptionId: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    customerId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: [
        "active",
        "past_due",
        "unpaid",
        "canceled",
        "incomplete",
        "incomplete_expired",
        "trialing",
        "paused",
      ],
    },
    paymentIntent: {
      type: String,
      required: true,
    },
    refundId: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

paymentSchema.pre("find", function () {
  this.where("endDate").gte(new Date())
})
paymentSchema.pre("findOne", function () {
  this.where("endDate").gte(new Date())
})
paymentSchema.pre("findById", function () {
  this.where("endDate").gte(new Date())
})

const Payments = mongoose.model("Payments", paymentSchema)

export default Payments
