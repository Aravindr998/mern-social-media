import { Router } from "express"
import { isUserLoggedin } from "../controllers/authController.js"
import {
  createPost,
  getPosts,
  getPostOfOneUser,
  setLike,
  setComment,
  validateComment,
} from "../controllers/postController.js"
import {} from "../helpers/postHelper.js"
import upload from "../middlewares/multerConfig.js"
import "../auth/localStrategy.js"
import "../auth/auth.js"

const router = Router()

router.get("/", isUserLoggedin, getPosts)

router.post("/create", isUserLoggedin, upload.single("post"), createPost)

router.get("/user/:username", isUserLoggedin, getPostOfOneUser)

router.patch("/like", isUserLoggedin, setLike)

router.patch("/comment", isUserLoggedin, validateComment, setComment)

export default router
