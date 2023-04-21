import mongoose from "mongoose"

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    content: String,
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "conversations",
    },
    readBy: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "users",
    },
  },
  {
    timestamps: true,
  }
)

const Messages = mongoose.model("Messages", messageSchema)

export default Messages
