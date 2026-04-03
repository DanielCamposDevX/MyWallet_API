import type { NextFunction, Request, Response } from "express";
import * as yup from "yup";
import { authorizationHeaderSchema } from "../../../../../shared/utils/request/authorizationHeaderSchema.js";
import { validateYupSchema } from "../../../../../shared/utils/request/validateYupSchema.js";

const createSessionBodySchema = yup.object({
  email: yup.string().email().required().label("email"),
  password: yup.string().min(3).required().label("password"),
});

const createSessionSchema = {
  body: createSessionBodySchema,
};

const deleteSessionSchema = {
  headers: authorizationHeaderSchema,
};

export type CreateSessionBody = yup.InferType<typeof createSessionBodySchema>;

class SessionsRequest {
  public async create(
    request: Request,
    _response: Response,
    next: NextFunction
  ): Promise<Response | void> {
    await validateYupSchema(request, createSessionSchema);
    return next();
  }

  public async delete(
    request: Request,
    _response: Response,
    next: NextFunction
  ): Promise<Response | void> {
    await validateYupSchema(request, deleteSessionSchema);
    return next();
  }
}

export { SessionsRequest };
