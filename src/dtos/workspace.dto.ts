import { z } from "zod";

// Base schema (shared fields)
const workspaceBaseSchema = {
  name: z.string().min(1, { message: "Workspace name is required" }),
};

// Main schemas
export const createWorkspaceSchema = z.object({
  ...workspaceBaseSchema,
  userId: z.string().min(1, { message: "User ID is required" }),
});

export const updateWorkspaceSchema = z.object({
  name: z.string().min(1).optional(),
});

// Params schema
export const workspaceIdSchema = z.object({
  id: z.string().min(1, { message: "Workspace ID is required" }),
});

// Response schema
export const workspaceResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const inviteUserToWorkspaceSchema = z.object({
  workspaceId: z.string().min(1),
  userId: z.string().min(1),
  role: z.enum(["owner", "editor", "viewer"]),
});

// Types
export type CreateWorkspaceDto = z.infer<typeof createWorkspaceSchema>;
export type UpdateWorkspaceDto = z.infer<typeof updateWorkspaceSchema>;
export type WorkspaceIdParams = z.infer<typeof workspaceIdSchema>;
export type WorkspaceResponseDto = z.infer<typeof workspaceResponseSchema>;
export type InviteUserDto = z.infer<typeof inviteUserToWorkspaceSchema>;

// Validators
export const validateCreateWorkspace = (data: unknown) => {
  return createWorkspaceSchema.parse(data);
};

export const validateInvitePayload = (data: unknown): InviteUserDto => {
  return inviteUserToWorkspaceSchema.parse(data);
};

export const validateUpdateWorkspace = (data: unknown) => {
  return updateWorkspaceSchema.parse(data);
};

export const validateWorkspaceId = (data: unknown) => {
  return workspaceIdSchema.parse(data);
};
