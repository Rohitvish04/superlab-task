import { Router } from "express";
import { AccessRefreshToken, getCurrentUser, loginUser, logOutUser, registerUser } from "../controllers/user.controller.js";
import { verifyjwt } from "../middelware/auth.middleware.js";

const router=Router();
// console.log("➡️ registerUser route hit")
 
router.route("/register").post(
registerUser)
    router.route("/login").post(loginUser)

    //secured route
    router.route("/logout").post(verifyjwt
        ,logOutUser)
        router.route("/accesstokenRefresh").post(AccessRefreshToken)
        router.route("/cuurentuser").post(getCurrentUser)

export default router;