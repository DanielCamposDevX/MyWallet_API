import bcrypt from "bcrypt";
import { injectable } from "tsyringe";
import { IHashProvider } from "../models/IHashProvider.js";

@injectable()
class BCryptHashProvider implements IHashProvider {
  public async generateHash(payload: string): Promise<string> {
    return bcrypt.hash(payload, 10);
  }

  public async compareHash(payload: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(payload, hashed);
  }
}

export { BCryptHashProvider };
