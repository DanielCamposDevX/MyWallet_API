import type { NextFunction, Request, Response } from "express";
import { container } from "tsyringe";
import { AppError } from "../../../errors/AppError.js";
import { FindSessionByTokenService } from "../../../../modules/sessions/services/FindSessionByTokenService.js";

async function ensureAuthenticated(
  request: Request,
  _response: Response,
  next: NextFunction
): Promise<void> {
  const { authorization } = request.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new AppError("Invalid authorization header", 401);
  }

  const token = authorization.replace("Bearer ", "");

  const findSessionByToken = container.resolve(FindSessionByTokenService);
  const session = await findSessionByToken.execute({ token });

  request.user = { id: session.userId };

  next();
}

export { ensureAuthenticated };
