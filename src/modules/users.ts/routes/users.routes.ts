import { Router } from "express";
import { logoff, signin, signup } from "../controllers/users.js";

const userRouter = Router();

userRouter.post("/signin", signin);
userRouter.post("/signup", signup);
userRouter.post("/logoff", logoff);

export default userRouter;
