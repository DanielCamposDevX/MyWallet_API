import type { Request, Response } from "express";
import { container } from "tsyringe";
import { FindUserByEmailService } from "../../../../users/services/FindUserByEmailService.js";
import { AuthenticateUserService } from "../../../services/AuthenticateUserService.js";
import { FindSessionByTokenService } from "../../../services/FindSessionByTokenService.js";
import { LogoffUserService } from "../../../services/LogoffUserService.js";

class SessionsController {
  public async create(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const findUserByEmailService = container.resolve(FindUserByEmailService);

    const user = await findUserByEmailService.execute({ email });

    const authenticateUser = container.resolve(AuthenticateUserService);

    const data = await authenticateUser.execute({ user, password });
    return response.status(200).json(data);
  }

  public async delete(request: Request, response: Response): Promise<Response> {
    const { authorization } = request.headers;
    const token = authorization?.replace("Bearer ", "") ?? "";

    const findSessionBytoken = container.resolve(FindSessionByTokenService);

    const session = await findSessionBytoken.execute({ token });

    const logoffUser = container.resolve(LogoffUserService);

    await logoffUser.execute(session.id);
    return response.status(200);
  }
}

export { SessionsController };
