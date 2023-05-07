import { Router } from "express"
import { isUserLoggedin } from "../controllers/authController.js"
import { initiatePayment } from "../controllers/paymentController.js"

const router = Router()

router.post("/subscription", isUserLoggedin, initiatePayment)

export default router
