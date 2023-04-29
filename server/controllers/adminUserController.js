import userModel from "../model/User.js"
import postModel from "../model/Posts.js"

export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find()
    return res.json(users)
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .json({ message: "Some error occured, Please try again later" })
  }
}

export const blockUser = async (req, res) => {
  try {
    const { userId } = req.body
    const user = await userModel.findById(userId).select("-password")
    user.isBlocked = !user.isBlocked
    await user.save()
    res.json(user)
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .json({ message: "Some error occured, Please try again later" })
  }
}

export const getUserDetails = async (req, res) => {
  try {
    const { id } = req.params
    const user = await userModel.findById(id).select("-password")
    res.json(user)
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .json({ message: "Some error occured, Please try again later" })
  }
}

export const getPostsOfOneUser = async (req, res) => {
  try {
    const { userId } = req.params
    const posts = await postModel
      .find()
      .where({ createdBy: userId, shared: false })
    res.json(posts)
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .json({ message: "Some error occured, Please try again later" })
  }
}
