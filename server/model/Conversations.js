import mongoose from "mongoose"

const conversationSchema = new mongoose.Schema(
  {
    chatName: String,
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    users: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "users",
    },
    latestMessage: {
      type: new mongoose.Schema(
        {
          sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
          },
          message: String,
        },
        { timestamps: true }
      ),
    },
  },
  {
    timestamps: true,
  }
)

const Conversations = mongoose.model("Conversations", conversationSchema)

export default Conversations
