import userModel from "../model/User.js"

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
