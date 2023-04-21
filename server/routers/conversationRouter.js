import { Router } from "express"
import { isUserLoggedin } from "../controllers/authController.js"
import {
  getAllConversations,
  createNewConversation,
  getMessages,
  sendMessage,
} from "../controllers/conversationController.js"

const router = Router()

router.get("/", isUserLoggedin, getAllConversations)

router.post("/create", isUserLoggedin, createNewConversation)

router.get("/:conversationId", isUserLoggedin, getMessages)

router.post("/message/:conversationId", isUserLoggedin, sendMessage)

export default router
