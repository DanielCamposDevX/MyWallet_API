import { Router } from "express";
import transactionsRouter from "./modules/transactions/routes/transactions.routes.js";
import userRouter from "./modules/users.ts/routes/users.routes.js";

const router = Router();

router.use(transactionsRouter);
router.use(userRouter);

export default router;
