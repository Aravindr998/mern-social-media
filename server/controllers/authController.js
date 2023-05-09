import userModel from "../model/User.js"
import {
  isUsernameValid,
  validateRegister,
  createToken,
  validateLoginUser,
} from "../helpers/authHelper.js"
import passport from "passport"
import { checkOTPAsync, sendOTP } from "../helpers/otpHelper.js"
import adminModel from "../model/Admin.js"
import paymentModel from "../model/Payment.js"

export const validateUser = async (req, res, next) => {
  const { errors, isValid } = validateRegister(req.body)
  if (!isValid) {
    return res.status(400).json(errors)
  }
  try {
    const { email, phone, username } = req.body
    const existing = await userModel.findOne({ email })
    if (existing) {
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

export const googleAuthenticate = (req, res, next) => {
  passport.authenticate("google", { session: false }, async (err, user) => {
    try {
      if (err) {
        throw err
      }
      const token = createToken(user._id, user.email)
      res.cookie("token", token)
      res.redirect(`http://localhost:3000`)
    } catch (error) {
      console.log(error)
      return res.redirect("http://localhost:3000/login?authentication=failed")
    }
  })(req, res)
}

export const isUserLoggedin = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, async (err, user) => {
    try {
      if (err || !user) {
        throw err
      }
      const usr = await userModel.findById(user.id)
      if (usr.isBlocked) return res.status(403).json({ blocked: true })
      req.user = user
      next()
    } catch (error) {
      console.log(error)
      res.status(401).json({ notAuthenticated: true })
    }
  })(req, res)
}

export const isAdminLoggedin = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, async (err, user) => {
    try {
      if (err || !user) {
        throw err
      }
      req.user = user
      const isAdmin = await adminModel.findById(user.id)
      if (!isAdmin) throw "Not Authorized"
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
        if (user.isBlocked) {
          return res.status(401).json({ message: "User is blocked" })
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

export const authenticateGoogle = async (req, res) => {
  try {
    const token = createToken(req.user._id, req.user.email)
    res.cookie("token", token)
    res.redirect(`http://localhost:3000`)
  } catch (error) {
    console.log(error)
  }
}

export const failedGoogleAuthentication = async (req, res) => {
  res.redirect("http://localhost:3000/login?authentication=failed")
}
