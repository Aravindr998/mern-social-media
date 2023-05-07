import { Router } from "express"
import { isUserLoggedin } from "../controllers/authController.js"
import {
  createVideoCall,
  getCallDetails,
} from "../controllers/callController.js"

const router = Router()

router.post("/video", isUserLoggedin, createVideoCall)
router.get("/video/:callId", isUserLoggedin, getCallDetails)

export default router
