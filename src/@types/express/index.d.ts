import type { ParsedQs } from "qs";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
      };
      query: ParsedQs;
    }
  }
}

export {};
