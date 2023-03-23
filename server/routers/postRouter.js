import { Router } from "express"
import { isUserLoggedin } from "../controllers/authController.js"
import { createPost } from "../controllers/postController.js"
import upload from "../middlewares/multerConfig.js"
import "../auth/localStrategy.js"
import "../auth/auth.js"

const router = Router()

router.get("/", isUserLoggedin)

router.post("/create", isUserLoggedin, upload.single("post"), createPost)

export default router
