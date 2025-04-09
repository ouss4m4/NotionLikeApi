import asyncHandler from "express-async-handler";
import { Request, Response, Router } from "express";
import { BlockController } from "../controllers/block.controller";
import { authenticateJWT } from "../middleware/auth.middleware";

const blockRouter = Router();

blockRouter.get(
  "/",
  authenticateJWT,
  asyncHandler(async (req: Request, res: Response) => {
    console.log(req.user);
    await BlockController.getBlocks({ query: req.query }, res);
  })
);

blockRouter.post(
  "/",
  authenticateJWT,
  asyncHandler(async (req: Request, res: Response) => {
    await BlockController.createBlock(req, res);
  })
);

blockRouter.get(
  "/:id",
  authenticateJWT,
  asyncHandler(async (req: Request, res: Response) => {
    await BlockController.getBlockById({ params: req.params }, res);
  })
);

blockRouter.get(
  "/:id/children",
  authenticateJWT,
  asyncHandler(async (req: Request, res: Response) => {
    await BlockController.getBlockChildren({ params: req.params }, res);
  })
  //
);

export { blockRouter };
