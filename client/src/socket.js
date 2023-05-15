import { io } from "socket.io-client"

const URL = "https://www1.kromium.shop"
// const URL = "http://localhost:4000"

export const socket = io(URL, {
  autoConnect: false,
  secure: true,
})
