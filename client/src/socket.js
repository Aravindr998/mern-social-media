import { io } from "socket.io-client"

const URL =
  process.env.NODE_ENV === "production"
    ? undefined
    : "https://www1.kromium.shop"

export const socket = io(URL, {
  autoConnect: false,
})
