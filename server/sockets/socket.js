import { Server } from "socket.io"
import conversationModel from "../model/Conversations.js"
import jwt from "jsonwebtoken"

const io = new Server({
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
})

io.on("connection", (socket) => {
  console.log("user connected")

  socket.on("setup", (userData) => {
    try {
      const user = jwt.verify(userData.slice(7), process.env.TOKEN_SECRET_KEY)
      console.log("user joined")
      socket.join(user.user.id)
    } catch (error) {
      console.log(error)
    }
  })

  socket.on("joinChat", (conversation) => {
    socket.join(conversation._id)
    console.log("User joined chat" + conversation._id)
  })

  socket.on("newMessage", async (message) => {
    const conversation = await conversationModel.findById(message.conversation)
    conversation.users.forEach((user) => {
      console.log(user._id.toString())
      console.log(message.sender._id)
      if (user._id.toString() === message.sender._id) return
      console.log("emitting")
      socket.in(user._id.toString()).emit("latestMessage", message)
    })
  })
})

export default io
