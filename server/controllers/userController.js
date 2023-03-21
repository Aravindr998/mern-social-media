import { checkDetails } from "../helpers/authHelper.js"
import userModel from "../model/User.js"

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
