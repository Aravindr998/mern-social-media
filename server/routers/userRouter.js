import express from "express"
import {
  authenticate,
  validateUser,
  verifyOtp,
  isUserLoggedin,
  resendOtp,
  validateLogin,
  loginUser,
} from "../controllers/authController.js"
import {
  validateDetails,
  addDetails,
  getDetails,
  getSearchResult,
  getUserDetails,
} from "../controllers/userController.js"
import "../auth/localStrategy.js"
import "../auth/auth.js"
const router = express.Router()

router.post("/register", validateUser, authenticate)

router.patch("/register/otp", verifyOtp)

router.get("/register/otp/resend", resendOtp)

router.patch("/register/details", isUserLoggedin, validateDetails, addDetails)

router.post("/login", validateLogin, loginUser)

router.get("/user/details", isUserLoggedin, getDetails)

router.get("/users/search", isUserLoggedin, getSearchResult)

router.get("/user/profile/:username", isUserLoggedin, getUserDetails)

export default router
