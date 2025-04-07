import { prisma } from "../lib/prisma/prisma";
import { Request, Response } from "express";
import { validateCreateDocument, validateDocumentId, validateUpdateDocument } from "../dtos/document.dto";
import { ZodError } from "zod";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { ControllerContext } from "../typings/types";

export class DocumentController {
  static async getDocuments(res: Response) {
    try {
      const docs = await prisma.document.findMany({
        include: {
          blocks: true,
        },
      });
      res.status(200).json(docs);
      return;
    } catch (error) {
      DocumentController.handleError(error, res);
    }
  }
  static async createDocument(ctx: ControllerContext, res: Response) {
    try {
      const data = validateCreateDocument(ctx.body);
      const document = await prisma.document.create({ data });
      res.status(201).json(document);
    } catch (error) {
      DocumentController.handleError(error, res);
    }
  }

  static async getDocumentById(ctx: ControllerContext, res: Response) {
    try {
      const { id } = validateDocumentId(ctx.params);

      const document = await prisma.document.findUnique({
        where: { id },
        include: { blocks: true, comments: true },
      });

      if (!document) return res.status(404).json({ error: "Not found" });
      res.status(200).json(document);
    } catch (error) {
      DocumentController.handleError(error, res);
    }
  }

  static async updateDocument(ctx: ControllerContext, res: Response) {
    try {
      const { id } = validateDocumentId(ctx.params);
      const dto = validateUpdateDocument(ctx.body);

      // check doc exist
      const document = await prisma.document.update({
        where: { id },
        data: dto,
      });

      res.status(200).json(document);
    } catch (error) {
      DocumentController.handleError(error, res);
    }
  }

  static async deleteDocument(ctx: ControllerContext, res: Response) {
    try {
      const { id } = validateDocumentId(ctx.params);
      await prisma.document.delete({ where: { id } });
      res.status(204).send();
    } catch (error) {
      DocumentController.handleError(error, res);
    }
  }

  private static handleError(error: unknown, res: Response) {
    console.error("Document error:", error);
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
