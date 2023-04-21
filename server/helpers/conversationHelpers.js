import mongoose from "mongoose"
import conversationModel from "../model/Conversations.js"
import messageModel from "../model/Messages.js"

export const getAllRelatedConversations = async (id) => {
  try {
    const conversations = await conversationModel.aggregate([
      {
        $match: {
          users: new mongoose.Types.ObjectId(id),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "users",
          foreignField: "_id",
          as: "users",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "latestMessage.sender",
          foreignField: "_id",
          as: "latestMessage.sender",
        },
      },
      {
        $unwind: "latestMessage.sender",
      },
    ])
    return conversations
  } catch (error) {
    throw error
  }
}

export const getAllMessages = async (conversationId, userId) => {
  try {
    const messages = await conversationModel.aggregate([
      {
        $match: {
          _id: new mongoose.Types.ObjectId(conversationId),
          users: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "messages",
          localField: "_id",
          foreignField: "conversation",
          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "sender",
                foreignField: "_id",
                pipeline: [
                  {
                    $project: {
                      password: 0,
                      friends: 0,
                      savedPosts: 0,
                      pendingRequests: 0,
                      pendingSentRequest: 0,
                    },
                  },
                ],
                as: "sender",
              },
            },
            {
              $unwind: "$sender",
            },
            {
              $sort: {
                createdAt: 1,
              },
            },
          ],
          as: "messages",
        },
      },
    ])
    return messages
  } catch (error) {
    throw error
  }
}
