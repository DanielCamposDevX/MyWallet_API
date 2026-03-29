import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import { v4 as uuid } from "uuid";
import { AppDataSource } from "../../../database/data-source.js";
import { Session } from "../../sessions/Session.js";
import { User } from "../User.js";
import { signinSchema, signupSchema } from "../request/users.schemas.js";

export async function signin(req: Request, res: Response) {
  const { email, password } = req.body;
  const validation = signinSchema.validate(
    { email, password },
    { abortEarly: false }
  );

  if (validation.error) {
    const errors = validation.error.details.map((detail) => detail.message);
    return res.status(422).send(errors);
  }

  try {
    const userRepository = AppDataSource.getRepository(User);
    const sessionRepository = AppDataSource.getRepository(Session);

    const user = await userRepository.findOne({ where: { email } });
    if (!user) {
      return res.status(404).send("E-mail not found!");
    }

    const compare = bcrypt.compareSync(password, user.password);
    if (!compare) {
      return res.status(401).send("Wrong password");
    }

    const existingSession = await sessionRepository.findOne({
      where: { userId: user.id },
    });
    if (existingSession) {
      return res
        .status(200)
        .send({ token: existingSession.token, name: user.name });
    }

    const token = uuid();
    await sessionRepository.save({ userId: user.id, token });

    return res.status(200).send({ token, name: user.name });
  } catch (error) {
    return res.status(500).send((error as Error).message);
  }
}

export async function signup(req: Request, res: Response) {
  const { name, email, password } = req.body;
  const validation = signupSchema.validate(
    { name, email, password },
    { abortEarly: false }
  );

  if (validation.error) {
    const errors = validation.error.details.map((detail) => detail.message);
    return res.status(422).send(errors);
  }

  try {
    const userRepository = AppDataSource.getRepository(User);

    const user = await userRepository.findOne({ where: { email } });
    if (user) {
      return res.status(409).send("Email already in use");
    }

    const hash = bcrypt.hashSync(password, 10);
    await userRepository.save({ name, email, password: hash });

    return res.status(201).send("created");
  } catch (error) {
    return res.status(500).send((error as Error).message);
  }
}

export async function logoff(req: Request, res: Response) {
  const { authorization } = req.headers;
  const token = authorization?.replace("Bearer ", "");

  try {
    if (!token) {
      return res.status(401).send("Token error");
    }

    const sessionRepository = AppDataSource.getRepository(Session);
    const session = await sessionRepository.findOne({ where: { token } });

    if (!session) {
      return res.status(404).send("User Error");
    }

    await sessionRepository.delete({ id: session.id });
    return res.status(200).send("logged off");
  } catch (error) {
    return res.status(500).send((error as Error).message);
  }
}
