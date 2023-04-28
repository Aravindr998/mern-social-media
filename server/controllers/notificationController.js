import mongoose from "mongoose"
import notificationModel from "../model/Notifications.js"

export const getNotifications = async (req, res) => {
  try {
    const { id } = req.user
    const skip = req.query.skip || 0
    const notifications = await notificationModel.aggregate([
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
      {
        $limit: 10,
      },
      {
        $skip: skip,
      },
    ])
    return res.json(notifications)
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ message: "Something went wrong, please try again later" })
  }
}
