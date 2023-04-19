import postModel from "../model/Posts.js"
import userModel from "../model/User.js"
import {
  isPostValid,
  getAllRelatedPosts,
  isPostWithImageValid,
  isCommentValid,
} from "../helpers/postHelper.js"

export const createPost = async (req, res) => {
  try {
    const { id } = req.user
    let post
    if (req.file) {
      const { isValid, errors } = isPostWithImageValid(req.body)
      if (!isValid) {
        return res.status(400).json({ success: false, errors })
      }
      const path = req.file.path.slice(7)
      const filePath = process.env.BASE_URL + path
      post = new postModel({
        createdBy: id,
        description: req.body.description,
        location: req.body.location,
        media: filePath,
        privacy: req.body.privacy,
      })
    } else {
      const { isValid, errors } = isPostValid(req.body)
      if (!isValid) {
        return res.status(400).json({ success: false, errors })
      }
      post = new postModel({
        createdBy: id,
        description: req.body.description,
        location: req.body.location,
        privacy: req.body.privacy,
      })
    }
    await post.save()
    res.json({ success: true, post })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      success: false,
      message: "Something went wrong, please try again later",
    })
  }
}

export const validatePost = (req, res, next) => {
  if (!req.body.privacy) {
    return res
      .status(400)
      .json({ errors: { privacy: "Please select a privacy option" } })
  }
}

export const getPosts = async (req, res) => {
  try {
    const { id } = req.user
    const posts = await getAllRelatedPosts(id)
    res.json({ posts })
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong, please try again later" })
  }
}
export const getPostOfOneUser = async (req, res) => {
  try {
    const { id } = req.user
    const { username } = req.params
    const user = await userModel.findById(id)
    if (user.username === username) {
      const posts = await postModel.find({ createdBy: id })
      return res.json({ posts })
    } else {
      const otherUser = await userModel.findOne({ username })
      if (otherUser) {
        if (user.friends.includes(otherUser._id)) {
          const posts = await postModel.find({ createdBy: otherUser._id })
          return res.json({ posts })
        } else {
          const posts = await postModel.find({
            createdBy: otherUser._id,
            privacy: "public",
          })
          return res.json({ posts })
        }
      } else {
        res.status(404).json({ message: "User does not exist" })
      }
    }
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ message: "Something went wrong, Please try again later" })
  }
}

export const setLike = async (req, res) => {
  try {
    const { postId } = req.body
    const { id } = req.user
    const post = await postModel.findById(postId)
    if (post.likes.includes(id)) {
      await postModel.findByIdAndUpdate(postId, { $pull: { likes: id } })
      return res.json({ success: true, amount: -1 })
    } else {
      await postModel.findByIdAndUpdate(postId, { $push: { likes: id } })
      return res.json({ success: true, amount: 1 })
    }
  } catch (error) {
    console.log(error)
    res.status(500).status("Somthing went wrong, please try again later")
  }
}

export const setComment = async (req, res) => {
  try {
    const { postId, comment } = req.body
    const value = {
      userId: req.user.id,
      text: comment,
    }
    await postModel.findByIdAndUpdate(postId, { $push: { comments: value } })
    res.json({ success: true })
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ message: "Something went wrong, please try again later" })
  }
}

export const validateComment = (req, res, next) => {
  const { isValid, errors } = isCommentValid(req.body.comment)
  if (!isValid) {
    return res.status(400).json(errors)
  }
  next()
}
