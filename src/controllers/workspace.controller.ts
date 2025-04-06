import { Request, Response } from "express";
import { prisma } from "../lib/prisma/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import {
  validateCreateWorkspace,
  CreateWorkspaceDto,
  validateWorkspaceId,
  validateUpdateWorkspace,
  validateInvitePayload,
  validateUpdateMemberRolePayload,
  validateRemoveWorkspaceMemberPayload,
} from "../dtos/workspace.dto";

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
    try {
      const { id } = validateWorkspaceId(ctx.params);

      const workspace = await prisma.workspace.findUnique({ where: { id }, include: { members: true } });

      if (!workspace) {
        res.status(404).json({ error: "Workspace not found" });
        return;
      }

      res.status(200).json(workspace);

      return;
    } catch (error) {
      WorkspaceController.handleError(error, res);
    }
  }

  public static async addMember(ctx: ControllerContext, res: Response): Promise<void> {
    try {
      const { id } = validateWorkspaceId(ctx.params);
      const { workspaceId, userId, role } = validateInvitePayload(ctx.body);

      if (id != workspaceId) {
        res.status(400).json({ error: "workspace id not matching" });
      }

      const workspace = await prisma.workspace.findUnique({ where: { id: workspaceId } });
      if (!workspace) {
        res.status(404).json({ error: "Workspace not found" });
        return;
      }

      const existingMember = await prisma.workspaceMember.findUnique({
        where: {
          userId_workspaceId: {
            userId,
            workspaceId,
          },
        },
      });

      if (existingMember) {
        res.status(409).json({ error: "User already a member of this workspace" });
        return;
      }

      const newMember = await prisma.workspaceMember.create({
        data: {
          workspaceId,
          userId,
          role,
        },
      });
      res.status(201).json(newMember);
    } catch (error) {
      WorkspaceController.handleError(error, res);
    }
  }

  public static async editMemberRole(ctx: ControllerContext, res: Response): Promise<void> {
    try {
      const { workspaceId, userId, role } = validateUpdateMemberRolePayload(ctx.body);

      const workspace = await prisma.workspace.findUnique({ where: { id: workspaceId } });
      if (!workspace) {
        res.status(404).json({ error: "Workspace not found" });
        return;
      }

      const existingMember = await prisma.workspaceMember.findUnique({
        where: {
          userId_workspaceId: {
            userId,
            workspaceId,
          },
        },
      });

      if (!existingMember) {
        res.status(409).json({ error: "User not a member of this workspace" });
        return;
      }
      if (existingMember.role == "owner") {
        res.status(409).json({ error: "User is owner of the workspace" });
        return;
      }

      await prisma.workspaceMember.update({
        where: {
          userId_workspaceId: {
            userId,
            workspaceId,
          },
        },
        data: {
          role,
        },
      });

      res.status(200).json({ message: "Member role updated" });
    } catch (error) {
      WorkspaceController.handleError(error, res);
    }
  }

  public static async removeMember(ctx: ControllerContext, res: Response): Promise<void> {
    // cheidck workspace and member exist
    // res.json(ctx);
    // return;

    const { workspaceId, userId } = validateRemoveWorkspaceMemberPayload({ workspaceId: ctx.params.id, userId: ctx.params.userId });

    // check workspace
    const workspace = await prisma.workspace.findUnique({ where: { id: workspaceId } });
    if (!workspace) {
      res.status(404).json({ error: "Workspace not found" });
      return;
    }

    // check member
    const existingMember = await prisma.workspaceMember.findUnique({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
    });

    if (!existingMember) {
      res.status(409).json({ error: "User not a member of this workspace" });
      return;
    }
    if (existingMember.role == "owner") {
      res.status(409).json({ error: "User is owner of the workspace" });
      return;
    }

    // remove member
    await prisma.workspaceMember.delete({
      where: {
        userId_workspaceId: {
          userId,
          workspaceId,
        },
      },
    });

    res.status(200).json({ message: "Member removed from workspace" });
  }

  public static async updateWorkspaceById(ctx: ControllerContext, res: Response): Promise<void> {
    try {
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
    } catch (error) {
      WorkspaceController.handleError(error, res);
    }
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
