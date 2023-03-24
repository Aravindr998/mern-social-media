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
  console.log(post.description)
  if (!post.privacy) {
    errors.privacy = "Please select a privacy option"
  }
  const isValid = !Object.keys(errors).length
  return { isValid, errors }
}

export const getAllRelatedPosts = async (id) => {
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
    ])
    return posts
  } catch (error) {
    console.log(error)
    throw error
  }
}
