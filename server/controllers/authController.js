import userModel from "../model/User.js"
import {
  isUsernameValid,
  validateRegister,
  createToken,
  validateLoginUser,
} from "../helpers/authHelper.js"
import passport from "passport"
import { checkOTPAsync, sendOTP } from "../helpers/otpHelper.js"

export const validateUser = async (req, res, next) => {
  const { errors, isValid } = validateRegister(req.body)
  if (!isValid) {
    return res.status(400).json(errors)
  }
  try {
    const { email, phone, username } = req.body
    const existing = await userModel.findOne({ email })
    if (existing) {
      console.log(existing)
      return res.status(409).json({ message: "User already exists" })
    }
    const phoneExisting = await userModel.findOne({ phone })
    if (phoneExisting) {
      return res
        .status(409)
        .json({ existing: "Phone number already registered" })
    }
    const usernameExisting = await userModel.findOne({ username })
    if (usernameExisting) {
      return res.status(409).json({ message: "Username already exists" })
    }
    return next()
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .json({ message: "Something went wrong. Please try again later" })
  }
}

export const authenticate = (req, res, next) => {
  passport.authenticate("signup", { session: false }, async (err, user) => {
    try {
      if (err) {
        throw err
      }
      res.json({ success: true, user })
      sendOTP(user.phone)
    } catch (error) {
      console.log(error)
      return res
        .status(500)
        .json({ message: "Something went wrong. Please try again later" })
    }
  })(req, res, next)
}

export const isUserLoggedin = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, async (err, user) => {
    try {
      if (err || !user) {
        throw err
      }
      req.user = user
      next()
    } catch (error) {
      console.log(error)
      res.status(401).json({ notAuthenticated: true })
    }
  })(req, res)
}

export const verifyOtp = async (req, res) => {
  try {
    const { id } = req.query
    const user = await userModel.findById(id)
    if (user.isVerified) {
      return res.json({ success: false, verified: true })
    }
    const verification = await checkOTPAsync(user.phone, req.body.otp)
    console.log(verification)
    if (verification) {
      await userModel.findByIdAndUpdate(id, { isVerified: true })
      await userModel.findOneAndUpdate({ _id: id }, { $unset: { otp: 1 } })
      const token = createToken(user.id, user.email)
      return res.json({ success: true, token, user })
    }
    return res.json({ success: false, verified: false })
  } catch (error) {
    console.log(error)
    return res
      .status(500)
      .json({ message: "Something went wrong. Please try again later" })
  }
}

export const resendOtp = async (req, res) => {
  try {
    const { id } = req.query
    const user = await userModel.findById(id)
    if (user.isVerified) {
      return res.json({ success: false, verified: true })
    }
    sendOTP(user.phone)
    return res.json({ success: true })
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      success: false,
      message: "Something went wrong, please try again later",
    })
  }
}

export const validateLogin = async (req, res, next) => {
  const { errors, isValid } = validateLoginUser(req.body)
  if (!isValid) {
    return res.status(400).json(errors)
  }
  next()
}

export const loginUser = (req, res) => {
  passport.authenticate(
    "login",
    { session: false },
    async (err, user, info) => {
      try {
        if (err) {
          throw err
        }
        if (!user) {
          return res.status(401).json(info)
        }
        if (!user.isVerified) {
          sendOTP(user.phone)
          return res.status(403).json({ notVerified: true, user })
        }
        const token = createToken(user.id, user.email)
        return res.json({ success: true, token, user })
      } catch (error) {
        console.log(error)
        return res
          .status(500)
          .json({ message: "Something went wrong. Please try again later" })
      }
    }
  )(req, res)
}
