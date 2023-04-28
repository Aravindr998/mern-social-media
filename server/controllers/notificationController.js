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
        $lookup: {
          from: "users",
          localField: "to",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                password: 0,
              },
            },
          ],
          as: "to",
        },
      },
      {
        $unwind: {
          path: "$to",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "posts",
          localField: "postId",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                password: 0,
              },
            },
          ],
          as: "postId",
        },
      },
      {
        $unwind: {
          path: "$postId",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          $or: [
            {
              $and: [
                { "userId.friends": new mongoose.Types.ObjectId(id) },
                { type: "create" },
              ],
            },
            {
              $and: [
                { "to._id": new mongoose.Types.ObjectId(id) },
                { type: { $ne: "create" } },
              ],
            },
            {
              $and: [
                { "postId.createdBy": new mongoose.Types.ObjectId(id) },
                { "userId._id": { $ne: new mongoose.Types.ObjectId(id) } },
              ],
            },
          ],
        },
      },
      {
        $sort: {
          createdAt: -1,
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
