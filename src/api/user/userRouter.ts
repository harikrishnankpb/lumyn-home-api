import express, { type Router } from "express";
import { userController } from "./userController";
import { validateUser } from "@/common/middleware/auth";


const userRouter: Router = express.Router();

userRouter.post("/signIn", userController.signIn)
userRouter.post("/signUp", userController.signUp)

export { userRouter }