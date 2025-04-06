import { Request, Response } from "express";
import { prisma } from "../lib/prisma/prisma";
import { ZodError } from "zod";
import {
  CreateUserDto,
  UpdateUserDto,
  UserQueryParams,
  validateUserCreate,
  validateUserUpdate,
  validateUserId,
  validateUserQuery,
} from "../dtos/user.dto";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

type ControllerContext = {
  query?: any;
  body?: any;
  params?: any;
};

export class UserController {
  /**
   * Get all users with optional filtering
   * @param ctx Context containing query parameters
   * @param res Express response object
   */
  public static async getUsers(ctx: ControllerContext, res: Response): Promise<void> {
    try {
      // Validate query parameters
      const validatedQuery = validateUserQuery(ctx.query);

      const users = await prisma.user.findMany({
        where: {
          ...(validatedQuery?.email ? { email: validatedQuery.email } : {}),
        },
      });

      res.status(200).json(users);
    } catch (error) {
      UserController.handleError(error, res);
    }
  }

  /**
   * Get a single user by their ID
   * @param ctx Context containing user ID in params
   * @param res Express response object
   */
  public static async getUserById(ctx: ControllerContext, res: Response): Promise<void> {
    try {
      // Validate user ID
      const { id } = validateUserId(ctx.params);

      const user = await prisma.user.findUnique({
        where: { id },
      });

      if (!user) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      res.status(200).json(user);
    } catch (error) {
      UserController.handleError(error, res);
    }
  }

  /**
   * Create a new user
   * @param ctx Context containing user data in body
   * @param res Express response object
   */
  public static async createUser(ctx: ControllerContext, res: Response): Promise<void> {
    try {
      const userDto: CreateUserDto = { name: ctx.body?.name ?? "", email: ctx.body?.email ?? "" };
      // Validate request body against the schema
      const validatedData = validateUserCreate(userDto);

      const user = await prisma.user.create({
        data: {
          name: validatedData.name,
          email: validatedData.email.toLowerCase(),
        },
      });

      res.status(201).json(user);
    } catch (error) {
      UserController.handleError(error, res);
    }
  }

  /**
   * Update an existing user
   * @param ctx Context containing user ID in params and update data in body
   * @param res Express response object
   */
  public static async updateUser(ctx: ControllerContext, res: Response): Promise<void> {
    try {
      // Validate user ID and update data
      const { id } = validateUserId(ctx.params);
      const updateData = validateUserUpdate(ctx.body);

      // Check if at least one field is provided for update
      if (Object.keys(updateData).length === 0) {
        res.status(400).json({ error: "No fields provided for update" });
        return;
      }

      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { id },
      });

      if (!existingUser) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      const updatedUser = await prisma.user.update({
        where: { id },
        data: updateData,
      });

      res.status(200).json(updatedUser);
    } catch (error) {
      UserController.handleError(error, res);
    }
  }

  /**
   * Delete a user by their ID
   * @param ctx Context containing user ID in params
   * @param res Express response object
   */
  public static async deleteUser(ctx: ControllerContext, res: Response): Promise<void> {
    try {
      // Validate user ID
      const { id } = validateUserId(ctx.params);

      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { id },
      });

      if (!existingUser) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      await prisma.user.delete({
        where: { id },
      });

      res.status(204).send();
    } catch (error) {
      UserController.handleError(error, res);
    }
  }

  /**
   * Centralized error handling for controller methods
   * @param error The caught error
   * @param res Express response object
   */
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
