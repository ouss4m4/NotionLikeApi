import { Request, Response, Router } from "express";
import { UserController } from "../controllers/user.controller";
import asyncHandler from "express-async-handler";

/**
 * User Router
 * Handles all routes related to user management with full CRUD operations
 */
const userRouter = Router();

/**
 * Route for getting all users with optional filtering
 * GET /api/v1/users
 */
userRouter.get("/", asyncHandler(async (req: Request, res: Response) => {
  await UserController.getUsers({ query: req.query }, res);
}));

/**
 * Route for getting a single user by ID
 * GET /api/v1/users/:id
 */
userRouter.get("/:id", asyncHandler(async (req: Request, res: Response) => {
  await UserController.getUserById({ params: req.params }, res);
}));

/**
 * Route for creating a new user
 * POST /api/v1/users
 */
userRouter.post("/", asyncHandler(async (req: Request, res: Response) => {
  await UserController.createUser({ body: req.body }, res);
}));

/**
 * Route for updating an existing user
 * PUT /api/v1/users/:id
 */
userRouter.put("/:id", asyncHandler(async (req: Request, res: Response) => {
  await UserController.updateUser({ 
    params: req.params, 
    body: req.body 
  }, res);
}));

/**
 * Route for deleting a user
 * DELETE /api/v1/users/:id
 */
userRouter.delete("/:id", asyncHandler(async (req: Request, res: Response) => {
  await UserController.deleteUser({ params: req.params }, res);
}));

export default userRouter;
