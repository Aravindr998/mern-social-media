import { checkDetails, validateUpdatedDetails } from "../helpers/authHelper.js"
import { getOnlineUsersFromFriends } from "../helpers/userHelper.js"
import userModel from "../model/User.js"
import path from "path"

export const validateDetails = async (req, res, next) => {
  try {
    const { isValid, errors } = checkDetails(req.body)
    if (!isValid) {
      return res.status(400).json(errors)
    }
    const { username, location, gender } = req.body
    const existing = await userModel.findOne({ username: username })
    if (existing) {
      return res.status(407).json({ message: "Username already exists" })
    }
    next()
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .json({ message: "Something went wrong, Please try again later" })
  }
}

export const addDetails = async (req, res) => {
  try {
    const { id } = req.user
    const { username, location, gender } = req.body
    await userModel.findByIdAndUpdate(id, {
      $set: { username, location, gender },
    })
    return res.json({ success: true })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later",
    })
  }
}

export const getDetails = async (req, res) => {
  try {
    const { id } = req.user
    const user = await userModel.findById(id)
    res.json(user)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Something went wrong" })
  }
}

export const getSearchResult = async (req, res) => {
  try {
    const { key } = req.query
    if (key) {
      const result = await userModel.find({
        $or: [
          { firstName: new RegExp(key, "i") },
          { lastName: new RegExp(key, "i") },
          { username: new RegExp(key, "i") },
        ],
      })
      return res.json({ result })
    }
    return res.json({ result: [] })
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ message: "Something went wrong, Please try again later" })
  }
}

export const getUserDetails = async (req, res) => {
  try {
    const { username } = req.params
    const user = await userModel.findOne({ username })
    if (user) {
      const check = await userModel.findById(req.user.id)
      const friend = check.friends.includes(user._id)
      const pending = check.pendingSentRequest.includes(user._id)
      const requestReceived = check.pendingRequests.includes(user._id)
      return res.json({
        user,
        loggedinUser: req.user,
        friend,
        pending,
        requestReceived,
      })
    } else {
      return res.status(404).json({ message: "Requested user not found" })
    }
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ message: "Something went wrong, Please try again later" })
  }
}
export const setFriend = async (req, res) => {
  try {
    const { id } = req.user
    const friendId = req.body.id
    const user = await userModel.findById(id)
    if (user.friends.includes(friendId)) {
      await userModel.findByIdAndUpdate(id, {
        $pull: { friends: friendId },
      })
      await userModel.findByIdAndUpdate(friendId, {
        $pull: { friends: id },
      })
      return res.json({ success: true, message: "Add Friend" })
    } else if (user.pendingSentRequest.includes(friendId)) {
      await userModel.findByIdAndUpdate(id, {
        $pull: { pendingSentRequest: friendId },
      })
      await userModel.findByIdAndUpdate(friendId, {
        $pull: { pendingRequests: id },
      })
      return res.json({ success: true, message: "Add Friend" })
    } else if (user.pendingRequests.includes(friendId)) {
      await userModel.findByIdAndUpdate(id, {
        $pull: { pendingRequests: friendId },
      })
      await userModel.findByIdAndUpdate(friendId, {
        $pull: { pendingSentRequest: id },
      })
      await userModel.findByIdAndUpdate(id, { $push: { friends: friendId } })
      await userModel.findByIdAndUpdate(friendId, { $push: { friends: id } })
      return res.json({ success: true, message: "Unfriend" })
    } else {
      await userModel.findByIdAndUpdate(id, {
        $push: { pendingSentRequest: friendId },
      })
      await userModel.findByIdAndUpdate(friendId, {
        $push: { pendingRequests: id },
      })
      return res.json({ success: true, message: "Request Sent" })
    }
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ message: "Something went wrong, Please try again later" })
  }
}

export const editUser = async (req, res) => {
  try {
    const { id } = req.user
    const { isValid, errors } = validateUpdatedDetails(req.body)
    console.log(errors)
    if (!isValid) return res.status(400).json(errors)
    const user = await userModel.findById(id)
    const { firstName, lastName, username, email, location, date } = req.body
    user.firstName = firstName
    user.lastName = lastName
    user.username = username
    user.email = email
    user.location = location
    user.dob = date
    if (req?.files?.coverPicture) {
      // console.log(req.files.coverPicture)
      const coverPath = req.files.coverPicture[0].path
        .slice(7)
        .replace(new RegExp("\\" + path.sep, "g"), "/")
      const coverFilePath = process.env.BASE_URL + coverPath
      user.coverPicture = coverFilePath
    }
    if (req?.files?.profilePicture) {
      const profilePath = req.files.profilePicture[0].path
        .slice(7)
        .replace(new RegExp("\\" + path.sep, "g"), "/")
      const profileFilePath = process.env.BASE_URL + profilePath
      user.profilePicture = profileFilePath
    }
    await user.save()
    const updatedUser = await userModel.findById(id).select("-password")
    res.json(updatedUser)
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ message: "Something went wrong, Please try again later" })
  }
}

export const getFriendsList = async (req, res) => {
  try {
    const { id } = req.user
    const user = await userModel.findById(id).populate("friends")
    res.json(user.friends)
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ message: "Something went wrong, Please try again later" })
  }
}

export const getOnlineUsers = async (req, res) => {
  try {
    const { id } = req.user
    const onlineUsers = await getOnlineUsersFromFriends(id)
    return res.json(onlineUsers)
  } catch (error) {
    console.log(error)
    res
      .status(500)
      .json({ message: "Something went wrong, Please try again later" })
  }
}
