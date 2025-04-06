import { z } from "zod";

// Schemas
export const createDocumentSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  tags: z.array(z.string()).optional(),
  workspaceId: z.string().min(1),
  authorId: z.string().min(1),
});

export const updateDocumentSchema = z.object({
  title: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

// Params
export const documentIdSchema = z.object({
  id: z.string().min(1),
});

// Types
export type CreateDocumentDto = z.infer<typeof createDocumentSchema>;
export type UpdateDocumentDto = z.infer<typeof updateDocumentSchema>;
export type DocumentIdParams = z.infer<typeof documentIdSchema>;

// Validators
export const validateCreateDocument = (data: unknown): CreateDocumentDto => {
  return createDocumentSchema.parse(data);
};
export const validateUpdateDocument = (data: unknown): UpdateDocumentDto => updateDocumentSchema.parse(data);
export const validateDocumentId = (data: unknown): DocumentIdParams => documentIdSchema.parse(data);
