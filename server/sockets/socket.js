import { Server } from "socket.io"
import conversationModel from "../model/Conversations.js"
import jwt from "jsonwebtoken"
import onlineUsersModel from "../model/OnlineUsers.js"

const io = new Server({
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
})

io.on("connection", (socket) => {
  console.log("user connected", socket.id)
  socket.on("setup", async (userData) => {
    try {
      const user = jwt.verify(userData.slice(7), process.env.TOKEN_SECRET_KEY)
      const existing = await onlineUsersModel.findOne({ userId: user.user.id })
      if (existing) {
        existing.socketId = socket.id
        await existing.save()
        console.log(existing)
      } else {
        const newUser = new onlineUsersModel({
          userId: user.user.id,
          socketId: socket.id,
        })
        await newUser.save()
        console.log(newUser)
        if (newUser) {
          await newUser.populate("userId")
          const friends = newUser.userId.friends
          friends.forEach(async (friend) => {
            const onlineUser = await onlineUsersModel.findOne({
              userId: friend,
            })
            if (onlineUser)
              socket.to(onlineUser.socketId).emit("checkOnlineUsers")
          })
        }
      }
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

  socket.on("newConversation", (userId) => {
    socket.in(userId).emit("fetchConversation")
  })

  socket.on("newNotification", async (notification) => {
    const friends = notification.userId.friends
    for (let friend of friends) {
      const online = await onlineUsersModel.findOne({ userId: friend })
      if (online) {
        socket.to(online.socketId).emit("fetchNewNotification", notification)
      }
    }
  })

  socket.on("postInteracted", async (notification) => {
    try {
      console.log("here")
      console.log(notification)
      if (!notification) return
      const userId = notification.postId.createdBy
      const user = await onlineUsersModel.findOne({ userId })
      console.log(user)
      if (user) {
        socket.to(user.socketId).emit("fetchNewNotification", notification)
        console.log("emitted")
      }
    } catch (error) {
      console.log(error)
    }
  })

  socket.on("friendRequest", async (notification) => {
    if (!notification) return
    const userId = notification.to._id
    const user = await onlineUsersModel.findOne({ userId })
    if (user) {
      socket.to(user.socketId).emit("fetchNewNotification", notification)
    }
  })

  socket.on("disconnect", async () => {
    try {
      const inactive = await onlineUsersModel.findOneAndDelete({
        socketId: socket.id,
      })
      console.log(inactive)
      if (!inactive) return
      await inactive.populate("userId")
      const friends = inactive.userId.friends
      console.log(friends)
      friends.forEach(async (friend) => {
        const onlineUser = await onlineUsersModel.findOne({ userId: friend })
        console.log(onlineUser)
        if (onlineUser) socket.to(onlineUser.socketId).emit("checkOnlineUsers")
      })
      console.log("user disconnected", socket.id)
    } catch (error) {
      console.log(error)
    }
  })
})

export default io
