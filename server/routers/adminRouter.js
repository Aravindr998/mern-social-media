import { Router } from "express"
import {
  isAdminLoggedin,
  validateLogin,
} from "../controllers/authController.js"
import "../auth/adminLocalStrategy.js"
import { loginAdmin } from "../controllers/adminController.js"
import {
  getAllUsers,
  blockUser,
  getUserDetails,
  getPostsOfOneUser,
} from "../controllers/adminUserController.js"
const router = Router()

router.post("/login", validateLogin, loginAdmin)

router.get("/users", isAdminLoggedin, getAllUsers)

router.patch("/user/block", isAdminLoggedin, blockUser)

router.get("/user/:id", isAdminLoggedin, getUserDetails)

router.get("/post/:userId", isAdminLoggedin, getPostsOfOneUser)

export default router
