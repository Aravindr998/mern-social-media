import express from "express"
import {
  authenticate,
  validateUser,
  verifyOtp,
  isUserLoggedin,
  resendOtp,
} from "../controllers/authController.js"
import { validateDetails, addDetails } from "../controllers/userController.js"
import passport from "passport"
import "../auth/localStrategy.js"
import "../auth/auth.js"
const router = express.Router()

router.post("/register", validateUser, authenticate)

router.patch("/register/otp", isUserLoggedin, verifyOtp)

router.get("/register/otp/resend", isUserLoggedin, resendOtp)

router.patch("/register/details", isUserLoggedin, validateDetails, addDetails)

export default router
