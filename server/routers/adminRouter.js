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
  getActionsOfUser,
} from "../controllers/adminUserController.js"
const router = Router()

router.post("/login", validateLogin, loginAdmin)

router.get("/users", isAdminLoggedin, getAllUsers)

router.patch("/user/block", isAdminLoggedin, blockUser)

router.get("/user/:id", isAdminLoggedin, getUserDetails)

router.get("/user/post/:userId", isAdminLoggedin, getPostsOfOneUser)

router.get("/user/actions/:userId", isAdminLoggedin, getActionsOfUser)

export default router
