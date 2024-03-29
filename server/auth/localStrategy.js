import passport from "passport"
import { Strategy as localStrategy } from "passport-local"
import userModel from "../model/User.js"

passport.use(
  "signup",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      const { phone, firstName, lastName, username, dob } = req.body
      try {
        const user = new userModel({
          email,
          password,
          phone,
          firstName,
          lastName,
          username,
          dob,
        })
        await user.save()
        return done(null, user)
      } catch (error) {
        console.log(error)
        done(error)
      }
    }
  )
)
passport.use(
  "login",
  new localStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        const user = await userModel.findOne({ email })
        if (!user) {
          return done(null, false, { message: "User not found" })
        }
        const validate = await user.isValidPassword(password)
        if (!validate) {
          return done(null, false, { message: "Wrong Password" })
        }
        return done(null, user, { message: "Logged in successfully" })
      } catch (error) {
        return done(error)
      }
    }
  )
)
