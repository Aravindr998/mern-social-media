import { io } from "socket.io-client"

const URL = "https://www1.kromium.shop"

export const socket = io(URL, {
  autoConnect: false,
  secure: true,
})
