import express, { type Router } from "express";
import { blogController } from "./blogController";
import { verifyAdmin } from "@/common/middleware/auth";


const blogRouter: Router = express.Router();

// Post
blogRouter.post("/create", verifyAdmin, blogController.create)
blogRouter.post("/update", verifyAdmin, blogController.update)
blogRouter.post("/delete", verifyAdmin, blogController.delete)
blogRouter.post("/show", verifyAdmin, blogController.showOne)
blogRouter.post("/show-all", verifyAdmin, blogController.showAll)


// Get
blogRouter.get("/show-all-active", blogController.showAllActive) //Show to user
blogRouter.get("/show-active", blogController.showOneActive) //Show to user

export { blogRouter }