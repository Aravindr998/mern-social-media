import { Router } from "express"
import {
  isAdminLoggedin,
  validateLogin,
} from "../controllers/authController.js"
import "../auth/adminLocalStrategy.js"
import { loginAdmin } from "../controllers/adminController.js"
import { getAllUsers } from "../controllers/adminUserController.js"
const router = Router()

router.post("/login", validateLogin, loginAdmin)

router.get("/users", isAdminLoggedin, getAllUsers)

export default router
