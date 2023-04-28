import { Router } from "express"
import { isUserLoggedin } from "../controllers/authController.js"
import { getNotifications } from "../controllers/notificationController.js"
const router = Router()

router.get("/", isUserLoggedin, getNotifications)

export default router
