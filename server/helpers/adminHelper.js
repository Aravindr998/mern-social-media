import mongoose from "mongoose"
import notificationModel from "../model/Notifications.js"

export const getAllNotifications = async (userId) => {
  try {
    const notifications = await notificationModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "postId",
          foreignField: "_id",
          pipeline: [
            {
              $lookup: {
                from: "users",
                localField: "createdBy",
                foreignField: "_id",
                pipeline: [
                  {
                    $project: {
                      password: 0,
                    },
                  },
                ],
                as: "createdBy",
              },
            },
            {
              $unwind: "$createdBy",
            },
          ],
          as: "postId",
        },
      },
      {
        $unwind: "$postId",
      },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userId",
        },
      },
      {
        $unwind: "$userId",
      },
      {
        $lookup: {
          from: "users",
          localField: "to",
          foreignField: "_id",
          as: "to",
        },
      },
      {
        $unwind: {
          path: "$userId",
          preserveNullAndEmptyArrays: true,
        },
      },
    ])
    return notifications
  } catch (error) {
    throw error
  }
}
