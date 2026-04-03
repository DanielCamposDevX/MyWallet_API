import type { NextFunction, Request, Response } from "express";
import * as yup from "yup";
import { validateYupSchema } from "../../../../../shared/utils/request/validateYupSchema.js";

const createUserBodySchema = yup.object({
  name: yup.string().min(2).required().label("name"),
  email: yup.string().email().required().label("email"),
  password: yup.string().min(3).required().label("password"),
});

const createUserSchema = {
  body: createUserBodySchema,
};

export type CreateUserBody = yup.InferType<typeof createUserBodySchema>;

class UsersRequest {
  public async create(
    request: Request,
    _response: Response,
    next: NextFunction
  ): Promise<Response | void> {
    await validateYupSchema(request, createUserSchema);
    return next();
  }
}

export { UsersRequest };
