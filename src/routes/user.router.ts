import { Request, Response, Router } from "express";
import { UserController } from "../controllers/user.controller";
import asyncHandler from "express-async-handler";
import { authenticateJWT } from "../middleware/auth.middleware";

const userRouter = Router();

userRouter.get(
  "/",
  authenticateJWT,
  asyncHandler(async (req: Request, res: Response) => {
    await UserController.getUsers({ query: req.query }, res);
  })
);

userRouter.get(
  "/:id",
  authenticateJWT,
  asyncHandler(async (req: Request, res: Response) => {
    await UserController.getUserById({ params: req.params }, res);
  })
);

userRouter.post(
  "/register",
  asyncHandler(async (req: Request, res: Response) => {
    await UserController.createUser({ body: req.body }, res);
  })
);

userRouter.post(
  "/login",
  asyncHandler(async (req: Request, res: Response) => {
    await UserController.login(req, res);
  })
);

userRouter.put(
  "/:id",
  // authenticateJWT,
  asyncHandler(async (req: Request, res: Response) => {
    await UserController.updateUser(
      {
        params: req.params,
        body: req.body,
      },
      res
    );
  })
);

userRouter.delete(
  "/:id",
  authenticateJWT,
  asyncHandler(async (req: Request, res: Response) => {
    await UserController.deleteUser({ params: req.params }, res);
  })
);

export default userRouter;
