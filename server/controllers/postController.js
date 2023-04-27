import postModel from "../model/Posts.js"
import userModel from "../model/User.js"
import {
  isPostValid,
  getAllRelatedPosts,
  isPostWithImageValid,
  isCommentValid,
  getTotalPostsNumber,
  getCommentsFromPost,
  getPostForUserProfile,
  getPublicPostForUserProfile,
} from "../helpers/postHelper.js"
import mongoose from "mongoose"

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
    await post.populate("createdBy")
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
    const total = await getTotalPostsNumber(id)
    console.log(total.length)
    const posts = await getAllRelatedPosts(id)
    const totalCount = total[0]?.totalPosts || 0
    res.json({ posts, totalCount: total.length })
  } catch (error) {
    console.log(error)
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
      const posts = await getPostForUserProfile(id)
      return res.json({ posts })
    } else {
      const otherUser = await userModel.findOne({ username })
      if (otherUser) {
        if (user.friends.includes(otherUser._id)) {
          const posts = await getPostForUserProfile(otherUser._id)
          return res.json({ posts })
        } else {
          const posts = await getPublicPostForUserProfile(otherUser._id)
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
    const post = await postModel.findById(postId)
    const newComment = post.comments.create(value)
    post.comments.push(newComment)
    const updatedPost = await post.save()
    await post.populate({ path: "comments.userId", select: "-password" })
    if (updatedPost) {
      res.json(newComment)
    }
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

export const loadPosts = async (req, res) => {
  const { id } = req.user
  const { page } = req.query
  console.log(page)
  const skip = page * 10
  try {
    const posts = await getAllRelatedPosts(id, skip)
    res.json(posts)
  } catch (error) {
    res
      .status(500)
      .json({ message: "Something went wrong, please try again later" })
  }
}

export const loadComments = async (req, res) => {
  try {
    const { id } = req.user
    const { postId } = req.params
    const skip = req.query.page || 0
    const comments = await getCommentsFromPost(postId, parseInt(skip))
    res.json(comments)
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ message: "Something went wrong, please try again later" })
  }
}

export const getSinglePost = async (req, res) => {
  try {
    const { postId } = req.params
    const { id } = req.user
    const post = await postModel.findById(postId)
    if (id !== post.createdBy.toString())
      return res.status(403).json({ message: "User not authorized" })
    res.json(post)
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ message: "Something went wrong, please try again later" })
  }
}

export const editPost = async (req, res) => {
  try {
    const { id } = req.user
    const { postId } = req.params
    const { privacy, location, description } = req.body
    const post = await postModel.findById(postId)
    if (post.createdBy.toString() !== id)
      return res.status(403).json({ message: "User not authorized" })
    if (post.media) {
      const { isValid, errors } = isPostWithImageValid(req.body)
      if (!isValid) {
        return res.status(400).json(errors)
      }
    } else {
      const { isValid, errors } = isPostValid(req.body)
      if (!isValid) {
        return res.status(400).json(errors)
      }
    }
    post.privacy = privacy
    post.location = location
    post.description = description
    await post.save()
    await post.populate({ path: "createdBy", select: "-password" })
    res.json(post)
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ message: "Something went wrong, please try again later" })
  }
}

export const deletePost = async (req, res) => {
  try {
    const { id } = req.user
    const { postId } = req.params
    const post = await postModel.findById(postId)
    if (post.createdBy.toString() !== id)
      return res.status(403).json({ message: "User not authorized" })
    post.isDeleted = true
    await post.save()
    res.json(post)
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ message: "Something went wrong, please try again later" })
  }
}

export const reportPost = async (req, res) => {
  try {
    const { id } = req.user
    const { postId } = req.params
    const post = await postModel.findById(postId)
    if (post.createdBy.toString() === id)
      res.status(403).json({ message: "Cannot report your own post" })
    if (!post.reported.includes(new mongoose.Types.ObjectId(id)))
      post.reported.push(id)
    await post.save()
    res.json({ success: true })
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ message: "Something went wrong, please try again later" })
  }
}

export const getPostToShare = async (req, res) => {
  try {
    const { postId } = req.params
    const post = await postModel.findById(postId)
    await post.populate({ path: "createdBy", select: "-password" })
    if (post.privacy === "private") {
      res.status(403).json({ message: "Cannot share private posts" })
    }
    res.json(post)
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ message: "Something went wrong, please try again later" })
  }
}

export const sharePost = async (req, res) => {
  try {
    const { id } = req.user
    const { isValid, errors } = isPostWithImageValid(req.body)
    if (!isValid) return res.status(400).json(errors)
    let { privacy, description, sharedPostId, shared } = req.body
    if (shared) {
      const post = await postModel.findById(sharedPostId)
      sharedPostId = post.postId
    }
    const post = new postModel({
      createdBy: id,
      privacy,
      description,
      postId: sharedPostId,
      shared: true,
    })
    await post.save()
    await post.populate({ path: "createdBy", select: "-password" })
    await post.populate({ path: "postId" })
    await post.populate({ path: "postId.createdBy", select: "-password" })
    res.json(post)
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ message: "Something went wrong, please try again later" })
  }
}

export const getSharedPost = async (req, res) => {
  try {
    const { postId } = req.params
    const post = await postModel.findById(postId)
    console.log(post)
    res.json(post.postId)
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ message: "Something went wrong, please try again later" })
  }
}

export const getAllDetailsOfSinglePost = async (req, res) => {
  try {
    const { id } = req.user
    const user = await userModel.findById(id)
    const { postId } = req.params
    const post = await postModel.findById(postId)
    if (!post) return res.status(404).json({ message: "Page not found" })
    if (post.shared) return res.status(301).json({ id: post.postId })
    if (post.privacy === "private" && !user.friends.includes(post.createdBy))
      return res.status(403).json({ message: "User not authorized" })
    await post.populate({ path: "createdBy", select: "-password" })
    res.json(post)
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ message: "Something went wrong, please try again later" })
  }
}
