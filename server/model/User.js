import mongoose from "mongoose"
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"],
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
  },
  username: {
    type: String,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  location: {
    type: String,
  },
  dob: {
    type: Date,
    // required: [true, "Date of birth is required"],
  },
  gender: {
    type: String,
    enum: ["male", "female", "others"],
  },
  profilePicture: {
    type: String,
  },
  coverPicture: {
    type: String,
  },
  pendingRequests: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
      createdAt: {
        type: Date,
        default: new Date(),
      },
    },
  ],
  friends: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "users",
  },
  blockedUsers: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "users",
  },
  savedPosts: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "posts",
  },
  isBlocked: {
    type: Boolean,
    default: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  status: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "status",
  },
})

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return
  const hash = await bcrypt.hash(this.password, 10)
  this.password = hash
  next()
})
userSchema.methods.isValidPassword = async function (password) {
  const compare = await bcrypt.compare(password, this.password)
  return compare
}

const Users = mongoose.model("Users", userSchema)

export default Users
