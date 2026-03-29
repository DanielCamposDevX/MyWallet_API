import { Router } from "express";
import {
  gettransactions,
  posttransactions,
} from "../controllers/transactions.js";

const transactionsRouter = Router();

transactionsRouter.get("/transactions", gettransactions);
transactionsRouter.post("/transactions", posttransactions);

export default transactionsRouter;
