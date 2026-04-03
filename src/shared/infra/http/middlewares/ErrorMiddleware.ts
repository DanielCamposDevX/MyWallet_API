import type { NextFunction, Request, Response } from "express";
import { AppError } from "../../../errors/AppError.js";

function errorMiddleware(
  error: Error,
  _request: Request,
  response: Response,
  _next: NextFunction
): Response {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json(error.message);
  }

  console.error(error);
  return response.status(500).json("Internal server error");
}

export { errorMiddleware };
