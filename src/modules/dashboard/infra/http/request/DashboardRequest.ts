import type { NextFunction, Request, Response } from "express";
import * as yup from "yup";
import { validateYupSchema } from "../../../../../shared/utils/request/validateYupSchema.js";

const workspaceParamsSchema = yup.object({
  workspaceId: yup.string().uuid().required().label("workspaceId"),
});

const dashboardQuerySchema = yup.object({
  month: yup
    .string()
    .matches(/^\d{4}-(0[1-9]|1[0-2])$/, "month must follow YYYY-MM")
    .required()
    .label("month"),
  tagId: yup.string().uuid().optional().label("tagId"),
});

const indexDashboardSchema = {
  params: workspaceParamsSchema,
  query: dashboardQuerySchema,
};

export type DashboardWorkspaceParams = yup.InferType<typeof workspaceParamsSchema>;
export type DashboardQuery = yup.InferType<typeof dashboardQuerySchema>;

class DashboardRequest {
  public async index(
    request: Request,
    _response: Response,
    next: NextFunction
  ): Promise<Response | void> {
    await validateYupSchema(request, indexDashboardSchema);
    return next();
  }
}

export { DashboardRequest };
