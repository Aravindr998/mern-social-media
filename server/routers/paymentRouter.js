import { Router, raw } from "express"
import {
  isAdminLoggedin,
  isUserLoggedin,
} from "../controllers/authController.js"
import {
  initiatePayment,
  getSubscriptionStatus,
  getAllUnverifiedSubscriptions,
  confirmSubscription,
  denySubscription,
  getSubscriptionDetails,
  cancelSubscription,
  handleWebHooks,
} from "../controllers/paymentController.js"

const router = Router()

router.post("/subscription", isUserLoggedin, initiatePayment)

router.get(
  "/subscription/status/:paymentIntent",
  isUserLoggedin,
  getSubscriptionStatus
)

router.get("/subscription/all", isAdminLoggedin, getAllUnverifiedSubscriptions)

router.patch("/subscription/confirm", isAdminLoggedin, confirmSubscription)

router.patch("/subscription/deny", isAdminLoggedin, denySubscription)

router.get("/subscription/details", isUserLoggedin, getSubscriptionDetails)

router.patch("/subscription/cancel", isUserLoggedin, cancelSubscription)

export default router
