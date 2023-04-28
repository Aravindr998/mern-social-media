import userModel from "../model/User.js"
import onlineUserModel from "../model/OnlineUsers.js"
import mongoose from "mongoose"

export const getOnlineUsersFromFriends = async (id) => {
  try {
    const onlineUsers = await onlineUserModel.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                password: 0,
              },
            },
          ],
          as: "userId",
        },
      },
      {
        $unwind: "$userId",
      },
      {
        $match: {
          "userId.friends": new mongoose.Types.ObjectId(id),
        },
      },
    ])
    return onlineUsers
  } catch (error) {
    throw error
  }
}
