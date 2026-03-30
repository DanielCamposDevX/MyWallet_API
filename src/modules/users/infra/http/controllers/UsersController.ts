import type { Request, Response } from "express";
import Joi from "joi";
import { container } from "tsyringe";
import { AppError } from "../../../../../shared/errors/AppError.js";
import { AuthenticateUserService } from "../../../../sessions/services/AuthenticateUserService.js";
import { CreateUserService } from "../../../../users/services/CreateUserService.js";

const createUserSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(3).required(),
});

class UsersController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { name, email, password } = request.body;

    const validation = createUserSchema.validate(
      { name, email, password },
      { abortEarly: false }
    );

    if (validation.error) {
      const errors = validation.error.details.map((detail) => detail.message);
      return response.status(422).json(errors);
    }
    try {
      const createUser = container.resolve(CreateUserService);

      const user = await createUser.execute({ name, email, password });

      const createSession = container.resolve(AuthenticateUserService);

      const session = await createSession.execute({ user, password });

      return response
        .status(201)
        .json({ token: session.token, userName: session.name });
    } catch (error) {
      if (error instanceof AppError) {
        return response.status(error.statusCode).json(error.message);
      }

      return response.status(500).json((error as Error).message);
    }
  }
}

export { UsersController };
