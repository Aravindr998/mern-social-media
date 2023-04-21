import { config } from "dotenv"
config()
import express from "express"
import cors from "cors"
import db from "./config/db.config.js"
import userRouter from "./routers/userRouter.js"
import postRouter from "./routers/postRouter.js"
import conversationRouter from "./routers/conversationRouter.js"

const app = express()

const PORT = process.env.PORT || 4000

app.use(express.static("./public"))
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`Server listening to port ${PORT}`)
  })
})

app.use("/api", userRouter)
app.use("/api/post", postRouter)
app.use("/api/conversation", conversationRouter)
