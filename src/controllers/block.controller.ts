import { Request, Response } from "express";
import { ControllerContext } from "../typings/types";
import { ZodError } from "zod";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { prisma } from "../lib/prisma/prisma";
import { validateCreateBlockPayload } from "../dtos/block.dto";
import { buildBlockTree } from "../lib/buildBlockTree";

export class BlockController {
  public static async createBlock(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req.user as any)?.id ?? "";
      if (!userId) {
        res.status(403);
        return;
      }

      const { documentId, type, content, parentId = null } = validateCreateBlockPayload(req.body);

      // bring the document and the workspaceId
      const document = await prisma.document.findUnique({
        where: { id: documentId },
        select: { workspaceId: true },
      });
      if (!document) {
        res.status(404).json({ message: "Document not found" });
        return;
      }

      // 2. Check if the user is a member of that workspace
      const userCreatingBlock = await prisma.workspaceMember.findFirst({
        where: {
          userId: userId,
          workspaceId: document.workspaceId,
        },
      });

      if (!userCreatingBlock) {
        res.status(403).json({ message: "User does not belong to this workspace" });
        return;
      }

      if (userCreatingBlock.role != "owner" && userCreatingBlock.role != "editor") {
        res.status(403).json({ message: "User is not allowed to create blocks" });
        return;
      }

      const block = await prisma.block.create({
        data: {
          type,
          content,
          documentId,
          createdById: userId,
          parentId,
        },
      });
      res.status(200).json(block);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  public static async getBlocks(ctx: ControllerContext, res: Response): Promise<void> {
    try {
      const blocks = await prisma.block.findMany({ include: { document: true, children: true, parent: true } });
      res.status(200).json(blocks);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  public static async getBlocksByDocumentId(ctx: ControllerContext, res: Response): Promise<void> {
    try {
      const { id } = ctx.params;
      if (!id) {
        res.status(404).json({ error: "Document Id Is Reqruied" });
        return;
      }

      // find parent blocks.
      const docBlocks = await prisma.block.findMany({
        where: {
          documentId: id,
        },
      });

      // for each block start nesting blocks if any
      const blocks = buildBlockTree(docBlocks);
      res.status(200).json(blocks);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  // get children of a block (blocks of a block)
  public static async getBlockChildren(ctx: ControllerContext, res: Response): Promise<void> {
    try {
      const { id: id = "" } = ctx.params;
      if (!id) {
        res.status(400).json({ error: "bad request format", message: "Block Id is required" });
        return;
      }

      // do we load other things on a block? like parentId for ui links? children for dropdowns?
      const children = await prisma.block.findFirst({ where: { id }, select: { children: true } });

      if (!children) {
        res.status(404).json({ error: "Block not found" });
        return;
      }

      res.status(200).json(children);
    } catch (error) {
      this.handleError(error, res);
    }
  }

  public static async getBlockById(ctx: ControllerContext, res: Response): Promise<void> {
    try {
      const { id: id = "" } = ctx.params;
      if (!id) {
        res.status(400).json({ error: "bad request format", message: "Block Id is required" });
        return;
      }

      // do we load other things on a block? like parentId for ui links? children for dropdowns?
      const block = await prisma.block.findFirst({ where: { id }, include: { parent: true, children: true } });

      if (!block) {
        res.status(404).json({ error: "Block not found" });
        return;
      }

      res.status(200).json(block);
    } catch (error) {
      this.handleError(error, res);
    }
  }
  private static handleError(error: unknown, res: Response): void {
    console.error("Error in UserController:", error);

    if (error instanceof ZodError) {
      // Validation error
      res.status(400).json({
        error: "Validation Error",
        details: error.errors,
      });
    } else if (error instanceof PrismaClientKnownRequestError) {
      // Handle Prisma specific errors
      if (error.code === "P2002") {
        res.status(409).json({
          error: "Conflict",
          message: "A resource with this identifier already exists",
        });
      } else {
        res.status(500).json({
          error: "Database Error",
          message: error.message,
        });
      }
    } else {
      // Generic server error
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
