import type { Request, Response } from "express";
import { container } from "tsyringe";
import { AuthenticateUserService } from "../../../../sessions/services/AuthenticateUserService.js";
import { CreateUserService } from "../../../../users/services/CreateUserService.js";
import type { CreateUserBody } from "../request/UsersRequest.js";

class UsersController {
  public async create(
    request: Request<Record<string, never>, unknown, CreateUserBody>,
    response: Response
  ): Promise<Response> {
    const { name, email, password } = request.body;

    const createUser = container.resolve(CreateUserService);

    const user = await createUser.execute({ name, email, password });

    const createSession = container.resolve(AuthenticateUserService);

    const session = await createSession.execute({ user, password });

    return response
      .status(201)
      .json({ token: session.token, userName: session.name });
  }
}

export { UsersController };
