import dayjs from "dayjs";
import type { Request, Response } from "express";
import { AppDataSource } from "../../../database/data-source.js";
import { Session } from "../../sessions/Session.js";
import { Transaction } from "../Transaction.js";
import { transactionSchema } from "../requests/transactions.schemas.js";

export async function gettransactions(req: Request, res: Response) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  try {
    if (!token) {
      return res.status(401).send("Token error");
    }

    const sessionRepository = AppDataSource.getRepository(Session);
    const transactionRepository = AppDataSource.getRepository(Transaction);

    const session = await sessionRepository.findOne({ where: { token } });
    if (!session) {
      return res.status(401).send("Session Expired");
    }

    const transactions = await transactionRepository.find({
      where: { userId: session.userId },
      order: { createdAt: "DESC" },
    });

    const payload = transactions.map((transaction) => ({
      id: transaction.id,
      data: {
        value: transaction.value,
        description: transaction.description,
        type: transaction.type,
      },
      sessionId: transaction.userId,
      date: transaction.date,
    }));

    return res.send(payload);
  } catch (error) {
    return res.status(500).send((error as Error).message);
  }
}

export async function posttransactions(req: Request, res: Response) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  try {
    if (!token) {
      return res.status(401).send("Token Error");
    }

    const sessionRepository = AppDataSource.getRepository(Session);
    const transactionRepository = AppDataSource.getRepository(Transaction);

    const session = await sessionRepository.findOne({ where: { token } });
    if (!session) {
      return res.status(401).send("Session Expired");
    }

    const { value, description, type } = req.body;
    const validation = transactionSchema.validate(
      { value, description, type },
      { abortEarly: false }
    );

    if (validation.error) {
      const errors = validation.error.details.map((detail) => detail.message);
      return res.status(422).send(errors);
    }

    await transactionRepository.save({
      value,
      description,
      type,
      date: dayjs().format("DD/MM"),
      userId: session.userId,
    });

    return res.status(201).send("Created");
  } catch (error) {
    return res.status(500).send((error as Error).message);
  }
}
