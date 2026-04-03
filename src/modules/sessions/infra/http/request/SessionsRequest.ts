import type { NextFunction, Request, Response } from "express";
import * as yup from "yup";
import { validateYupSchema } from "../../../../../shared/utils/request/validateYupSchema.js";

class SessionsRequest {
  public async create(
    request: Request,
    _response: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const schema = {
      body: yup.object({
        email: yup.string().email().required().label("email"),
        password: yup.string().min(3).required().label("password"),
      }),
    };

    await validateYupSchema(request, schema);
    return next();
  }

  public async delete(
    request: Request,
    _response: Response,
    next: NextFunction
  ): Promise<Response | void> {
    const schema = {
      headers: yup.object({
        authorization: yup
          .string()
          .matches(
            /^Bearer\s.+$/,
            "authorization must be in Bearer <token> format"
          )
          .required()
          .label("authorization"),
      }),
    };

    await validateYupSchema(request, schema);
    return next();
  }
}

export { SessionsRequest };
