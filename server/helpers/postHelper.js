import userModel from "../model/User.js"
import postModel from "../model/Posts.js"
import mongoose from "mongoose"

const isDescriptionValid = (description) => {
  const value = description.trim()
  if (!(value.length > 0)) {
    return false
  }
  return true
}

export const isPostValid = (post) => {
  const errors = {}
  if (!isDescriptionValid(post.description)) {
    errors.description = "Please enter a valid description"
  }
  if (!post.privacy) {
    errors.privacy = "Please select a privacy option"
  }
  const isValid = !Object.keys(errors).length
  return { isValid, errors }
}

export const isPostWithImageValid = (post) => {
  const errors = {}
  if (!post.privacy) {
    errors.privacy = "Please select a privacy option"
  }
  const isValid = !Object.keys(errors).length
  return { isValid, errors }
}

export const getAllRelatedPosts = async (id, skip = 0, limit = 10) => {
  try {
    const posts = await postModel.aggregate([
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "createdBy",
        },
      },
      {
        $unwind: {
          path: "$createdBy",
        },
      },
      {
        $match: {
          $or: [
            {
              "createdBy._id": new mongoose.Types.ObjectId(id),
            },
            {
              "createdBy.friends": new mongoose.Types.ObjectId(id),
            },
          ],
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "comments.userId",
          foreignField: "_id",
          as: "userId",
        },
      },
      {
        $set: {
          comments: {
            $map: {
              input: "$comments",
              as: "s",
              in: {
                $mergeObjects: [
                  "$$s",
                  {
                    userId: {
                      $filter: {
                        input: "$userId",
                        as: "s2",
                        cond: {
                          $eq: ["$$s2._id", "$$s.userId"],
                        },
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      },
      {
        $unset: "userId",
      },
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $limit: 10,
      },
    ])
    return posts
  } catch (error) {
    console.log(error)
    throw error
  }
}

export const isCommentValid = (comment) => {
  const errors = {}
  if (!(comment.trim().length > 0)) {
    errors.comment = "Please enter a valid comment"
  }
  const isValid = !Object.keys(errors).length
  return { isValid, errors }
}
