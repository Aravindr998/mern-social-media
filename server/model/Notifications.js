import mongoose from "mongoose"

const notificationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["post", "message", "friendRequest", "acceptedRequest", "create"],
      required: true,
    },
    interaction: {
      type: String,
      enum: ["liked", "commented", "shared"],
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Posts",
    },
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversations",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
  },
  {
    timestamps: true,
  }
)

const Notifications = mongoose.model("Notifications", notificationSchema)

export default Notifications
