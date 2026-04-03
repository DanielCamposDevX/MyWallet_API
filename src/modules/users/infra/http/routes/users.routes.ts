import { Router } from "express";
import { UsersController } from "../controllers/UsersController.js";
import { UsersRequest } from "../request/UsersRequest.js";

const usersRoutes = Router();
const usersController = new UsersController();
const usersRequest = new UsersRequest();

usersRoutes.post("/signup", usersRequest.create, usersController.create);

export { usersRoutes };
