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
  setFriend,
  editUser,
} from "../controllers/userController.js"
import "../auth/localStrategy.js"
import "../auth/auth.js"
import upload from "../middlewares/multerConfig.js"
const router = express.Router()

router.post("/register", validateUser, authenticate)

router.patch("/register/otp", verifyOtp)

router.get("/register/otp/resend", resendOtp)

router.patch("/register/details", isUserLoggedin, validateDetails, addDetails)

router.post("/login", validateLogin, loginUser)

router.get("/user/details", isUserLoggedin, getDetails)

router.get("/users/search", isUserLoggedin, getSearchResult)

router.get("/user/profile/:username", isUserLoggedin, getUserDetails)

router.patch("/friend/change", isUserLoggedin, setFriend)

router.patch(
  "/user/edit",
  isUserLoggedin,
  upload.fields([
    { name: "profilePicture", maxCount: 1 },
    { name: "coverPicture", maxCount: 2 },
  ]),
  editUser
)

export default router
