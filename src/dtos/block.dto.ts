import { z } from "zod";

export const createBlockSchema = z.object({
  type: z.string().min(1),
  content: z.any(),
  documentId: z.string().min(1),
  createdById: z.string().min(1),
  parentId: z.string().optional(),
});

export const updateBlockSchema = z.object({
  type: z.string().optional(),
  content: z.any().optional(),
  parentId: z.string().optional(),
});

export const blockIdSchema = z.object({
  id: z.string().min(1),
});

// Types
export type CreateBlockDto = z.infer<typeof createBlockSchema>;
export type UpdateBlockDto = z.infer<typeof updateBlockSchema>;
export type BlockIdParams = z.infer<typeof blockIdSchema>;

// Validators
export const validateCreateBlock = (data: unknown): CreateBlockDto => createBlockSchema.parse(data);
export const validateUpdateBlock = (data: unknown): UpdateBlockDto => updateBlockSchema.parse(data);
export const validateBlockId = (data: unknown): BlockIdParams => blockIdSchema.parse(data);
