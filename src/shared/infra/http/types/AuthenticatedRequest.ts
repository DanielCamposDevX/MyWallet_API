import type { Request } from "express";
import type { ParamsDictionary } from "express-serve-static-core";
import type { ParsedQs } from "qs";

type AuthenticatedRequest<
  P = ParamsDictionary,
  ResBody = unknown,
  ReqBody = unknown,
  ReqQuery = ParsedQs,
> = Request<P, ResBody, ReqBody, ReqQuery> & {
  user: {
    id: string;
  };
};

export { AuthenticatedRequest };
