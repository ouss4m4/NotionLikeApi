import { z } from "zod";

const userBaseSchema = {
  email: z.string().email({ message: "Invalid email format" }),
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
};

export const createUserSchema = z.object({
  ...userBaseSchema,
});

export const updateUserSchema = z.object({
  email: userBaseSchema.email.optional(),
  name: userBaseSchema.name.optional(),
});

export const userIdSchema = z.object({
  id: z.string().min(1, { message: "User ID is required" }),
});

export const userQuerySchema = z
  .object({
    email: z.string().email().optional(),
  })
  .optional();

// Response schema (what will be returned to clients)
export const userResponseSchema = z.object({
  id: z.string(),
  ...userBaseSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Infer TypeScript types from the Zod schemas
export type CreateUserDto = z.infer<typeof createUserSchema>;
export type UpdateUserDto = z.infer<typeof updateUserSchema>;
export type UserIdParams = z.infer<typeof userIdSchema>;
export type UserQueryParams = z.infer<typeof userQuerySchema>;
export type UserResponseDto = z.infer<typeof userResponseSchema>;

// Helper function to validate incoming requests
export const validateUserCreate = (data: unknown) => {
  return createUserSchema.parse(data);
};

export const validateUserUpdate = (data: unknown) => {
  return updateUserSchema.parse(data);
};

export const validateUserId = (data: unknown) => {
  return userIdSchema.parse(data);
};

export const validateUserQuery = (data: unknown) => {
  return userQuerySchema.parse(data);
};
