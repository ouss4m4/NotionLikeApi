import { Request, Response, Router } from "express";
import { UserController } from "../controllers/user.controller";
import asyncHandler from "express-async-handler";

const userRouter = Router();

userRouter.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    await UserController.getUsers({ query: req.query }, res);
  })
);

userRouter.get(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    await UserController.getUserById({ params: req.params }, res);
  })
);

userRouter.post(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    await UserController.createUser({ body: req.body }, res);
  })
);

userRouter.put(
  "/:id",
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
  asyncHandler(async (req: Request, res: Response) => {
    await UserController.deleteUser({ params: req.params }, res);
  })
);

export default userRouter;
