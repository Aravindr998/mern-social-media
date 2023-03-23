import mongoose from "mongoose"

const postSchema = new mongoose.Schema(
  {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    description: {
      type: String,
    },
    location: {
      type: String,
    },
    media: {
      type: String,
    },
    shared: {
      type: Boolean,
      default: false,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "posts",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    likes: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "users",
    },
    comments: {
      type: [
        new mongoose.Schema(
          {
            userId: {
              type: mongoose.Schema.Types.ObjectId,
              ref: "users",
            },
            text: {
              type: String,
            },
            isDeleted: {
              type: Boolean,
              default: false,
            },
            reply: {
              type: [
                new mongoose.Schema(
                  {
                    userId: {
                      type: mongoose.Schema.Types.ObjectId,
                      ref: "users",
                    },
                    text: {
                      type: String,
                    },
                    isDeleted: {
                      type: Boolean,
                      default: false,
                    },
                  },
                  { timestamps: true }
                ),
              ],
            },
          },
          { timestamps: true }
        ),
      ],
    },
    privacy: {
      type: String,
      enum: ["private", "public"],
      default: "public",
    },
  },
  { timestamps: true }
)

const Posts = mongoose.model("Posts", postSchema)

export default Posts
