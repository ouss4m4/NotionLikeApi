import { Request, Response } from "express";
import { prisma } from "../lib/prisma/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { validateCreateWorkspace, CreateWorkspaceDto, validateWorkspaceId, validateUpdateWorkspace } from "../dtos/workspace.dto";

type ControllerContext = {
  body?: any;
  params?: any;
};

export class WorkspaceController {
  public static async createWorkspace(ctx: ControllerContext, res: Response): Promise<void> {
    try {
      const data: CreateWorkspaceDto = validateCreateWorkspace(ctx.body);

      const workspace = await prisma.workspace.create({
        data: {
          name: data.name,
          members: {
            create: {
              userId: data.userId,
              role: "owner",
            },
          },
        },
        include: {
          members: true,
        },
      });

      res.status(201).json(workspace);
    } catch (error) {
      WorkspaceController.handleError(error, res);
    }
  }

  public static async getWorkspace(_: any, res: Response): Promise<void> {
    try {
      const workspaces = await prisma.workspace.findMany({});
      res.status(200).json(workspaces);
      return;
    } catch (error) {
      WorkspaceController.handleError(error, res);
    }
  }

  public static async getWorkspaceById(ctx: ControllerContext, res: Response): Promise<void> {
    const { id } = validateWorkspaceId(ctx.params);

    const workspace = await prisma.workspace.findUnique({ where: { id }, include: { members: true } });

    if (!workspace) {
      res.status(404).json({ error: "Workspace not found" });
      return;
    }

    res.status(200).json(workspace);

    return;
  }

  public static async updateWorkspaceById(ctx: ControllerContext, res: Response): Promise<void> {
    const { id } = validateWorkspaceId(ctx.params);
    const dto = validateUpdateWorkspace(ctx.body);

    const workspace = await prisma.workspace.findUnique({ where: { id } });
    if (!workspace) {
      res.status(404).json({ error: "Workspace not found" });
      return;
    }

    await prisma.workspace.update({
      where: { id },
      data: dto,
    });

    res.status(200).json(workspace);
  }
  private static handleError(error: unknown, res: Response): void {
    console.error("Error in WorkspaceController:", error);

    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        res.status(409).json({
          error: "Conflict",
          message: "A workspace with this name already exists",
        });
        return;
      }

      res.status(500).json({
        error: "Database Error",
        message: error.message,
      });
      return;
    }

    if (error instanceof Error && "issues" in error) {
      res.status(400).json({
        error: "Validation Error",
        details: (error as any).issues,
      });
      return;
    }

    res.status(500).json({ error: "Internal Server Error" });
  }
}
