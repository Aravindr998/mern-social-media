import { Server } from "socket.io"
import conversationModel from "../model/Conversations.js"
import jwt from "jsonwebtoken"
import onlineUsersModel from "../model/OnlineUsers.js"
import userModel from "../model/User.js"
import callModel from "../model/Call.js"
import cron from "node-cron"

const io = new Server({
  pingTimeout: 60000,
  cors: {
    origin: "https://vibee.kromium.shop",
    // origin: "http://localhost:3000",
  },
})

io.on("connection", (socket) => {
  console.log("user connected", socket.id)
  socket.on("setup", async (userData) => {
    try {
      const user = jwt.verify(userData.slice(7), process.env.TOKEN_SECRET_KEY)
      const existing = await onlineUsersModel.findOne({ socketId: socket.id })
      if (existing) {
        return
      }
      //else {
      const newUser = new onlineUsersModel({
        userId: user.user.id,
        socketId: socket.id,
      })
      await newUser.save()
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
      // }
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
      if (user._id.toString() === message.sender._id) return
      socket.in(user._id.toString()).emit("latestMessage", message)
    })
  })

  socket.on("newConversation", (userId) => {
    socket.in(userId).emit("fetchConversation")
  })

  socket.on("newNotification", async (notification) => {
    const friends = notification.userId.friends
    for (let friend of friends) {
      const online = await onlineUsersModel.find({ userId: friend })
      if (online.length) {
        online.forEach((item) => {
          socket.to(item.socketId).emit("fetchNewNotification", notification)
        })
      }
    }
  })

  socket.on("postInteracted", async (notification) => {
    try {
      if (!notification) return
      const userId = notification.postId.createdBy
      const user = await onlineUsersModel.find({ userId })
      if (user.length) {
        user.forEach((item) => {
          socket.to(item.socketId).emit("fetchNewNotification", notification)
        })
      }
    } catch (error) {
      console.log(error)
    }
  })

  socket.on("friendRequest", async (notification) => {
    if (!notification) return
    const userId = notification.to._id
    const user = await onlineUsersModel.find({ userId })
    if (user.length) {
      user.forEach((item) => {
        socket.to(item.socketId).emit("fetchNewNotification", notification)
      })
    }
  })

  socket.on("videoCall", async ({ data, id }) => {
    try {
      const user = await userModel.findById(id)
      if (!user.friends.includes(data.to._id))
        return socket.emit("unauthorizedCall")
      const callee = await onlineUsersModel.find({ userId: data.to._id })
      if (callee.length) {
        callee.forEach((item) => {
          socket.to(item.socketId).emit("newCall", data)
          console.log("emitting call")
        })
      }
    } catch (error) {
      console.log(error)
    }
  })

  socket.on("callRecieved", async (data) => {
    const onlineUsers = await onlineUsersModel.find({ userId: data.from._id })
    onlineUsers.forEach((item) => {
      socket.to(item.socketId).emit("callForwarded")
    })
  })

  socket.on("callAccepted", async (data) => {
    const onlineUsers = await onlineUsersModel.find({ userId: data.from._id })
    onlineUsers.forEach((item) => {
      socket.to(item.socketId).emit("userJoined", socket.id)
    })
    const callee = await onlineUsersModel.find({ userId: data.to._id })
    callee.forEach((item) => {
      socket.to(item._id).emit("userJoined", socket.id)
    })
  })

  socket.on("callRejected", async (data) => {
    const onlineUsers = await onlineUsersModel.find({ userId: data.from._id })
    onlineUsers.forEach((item) => {
      socket.to(item.socketId).emit("callRejected")
    })
  })

  socket.on("setOffer", async ({ callId, offer, user }) => {
    try {
      const call = await callModel.findById(callId)
      if (call.from.toString() === user._id.toString()) {
        const onlineUser = await onlineUsersModel.find({ userId: call.to })
        onlineUser.forEach((item) => {
          console.log("emitting new offer")
          socket.to(item.socketId).emit("newOffer", { from: user._id, offer })
        })
      } else if (call.to.toString() === user._id.toString()) {
        const onlineUser = await onlineUsersModel.find({ userId: call.from })
        onlineUser.forEach((item) => {
          console.log("emitting new offer")
          socket.to(item.socketId).emit("newOffer", { from: user._id, offer })
        })
      }
    } catch (error) {
      console.log(error)
    }
  })

  socket.on("callConnected", async ({ ans, callId }) => {
    try {
      console.log("reached here")
      console.log(ans)
      const user = await onlineUsersModel.findOne({ socketId: socket.id })
      const call = await callModel.findById(callId)
      console.log(callId)
      if (call.from.toString() === user.userId.toString()) {
        const onlineUser = await onlineUsersModel.find({ userId: call.to })
        onlineUser.forEach((item) => {
          socket
            .to(item.socketId)
            .emit("callConnected", { from: call.from, ans })
        })
      } else if (call.to.toString() === user.userId.toString()) {
        const onlineUser = await onlineUsersModel.find({ userId: call.from })
        onlineUser.forEach((item) => {
          socket.to(item.socketId).emit("callConnected", { from: call.to, ans })
        })
      }
    } catch (error) {
      console.log(error)
    }
  })

  socket.on("disconnect", async () => {
    try {
      const inactive = await onlineUsersModel.findOneAndDelete({
        socketId: socket.id,
      })
      if (!inactive) return
      await inactive.populate("userId")
      const friends = inactive.userId.friends
      friends.forEach(async (friend) => {
        const onlineUser = await onlineUsersModel.find({ userId: friend })
        if (onlineUser.length) {
          onlineUser.forEach((item) => {
            socket.to(item.socketId).emit("checkOnlineUsers")
          })
        }
      })
      console.log("user disconnected", socket.id)
    } catch (error) {
      console.log(error)
    }
  })
})

io.on("connect_error", (error) => {
  console.log("Socket connect_error:", error)
})

io.on("error", (error) => {
  console.log("Socket error:", error)
})

cron.schedule("0 */10 * * * *", async () => {
  const connectedSocketIDs = Array.from(io.of("/").sockets.keys())
  console.log(connectedSocketIDs)
  await onlineUsersModel.deleteMany({ socketId: { $nin: connectedSocketIDs } })
  console.log("deleted")
})

export default io
