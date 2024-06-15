import { Router } from "express";
import { registerUser } from "../controllers/user.Controllers.js";

const router=Router()


router.route("/register").post(registerUser)



export default router