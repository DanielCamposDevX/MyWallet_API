import type { Request, Response } from "express";
import { container } from "tsyringe";
import { getAuthenticatedUserId } from "../../../../../shared/infra/http/types/getAuthenticatedUserId.js";
import { GetWorkspaceDashboardService } from "../../../services/GetWorkspaceDashboardService.js";
import type { DashboardQuery, DashboardWorkspaceParams } from "../request/DashboardRequest.js";

class DashboardController {
  public async index(
    request: Request<DashboardWorkspaceParams, unknown, unknown, DashboardQuery>,
    response: Response
  ): Promise<Response> {
    const { workspaceId } = request.params;
    const { month, tagId } = request.query;
    const userId = getAuthenticatedUserId(request);

    const getWorkspaceDashboard = container.resolve(GetWorkspaceDashboardService);
    const dashboard = await getWorkspaceDashboard.execute({
      workspaceId,
      userId,
      month,
      tagId,
    });

    return response.status(200).json(dashboard);
  }
}

export { DashboardController };
