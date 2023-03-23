import postModel from "../model/Posts.js"
import { isPostValid } from "../helpers/postHelper.js"

export const createPost = async (req, res) => {
  try {
    const { id } = req.user
    let post
    if (req.file) {
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
      console.log(isValid)
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
