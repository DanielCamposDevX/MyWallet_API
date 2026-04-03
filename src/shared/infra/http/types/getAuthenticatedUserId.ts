import type { Request } from "express";
import { AppError } from "../../../errors/AppError.js";

function getAuthenticatedUserId(request: Request): string {
  const userId = request.user?.id;

  if (!userId) {
    throw new AppError("Unauthorized", 401);
  }

  return userId;
}

export { getAuthenticatedUserId };
