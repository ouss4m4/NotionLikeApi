import asyncHandler from "express-async-handler";
import { Request, Response, Router } from "express";
import { BlockController } from "../controllers/block.controller";

const blockRouter = Router();

blockRouter.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    await BlockController.getBlocks({ query: req.query }, res);
  })
);

blockRouter.post(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    await BlockController.createBlock({ body: req.body }, res);
  })
);

blockRouter.get(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    await BlockController.getBlockById({ params: req.params }, res);
  })
);

blockRouter.get(
  "/:id/children",
  asyncHandler(async (req: Request, res: Response) => {
    await BlockController.getBlockChildren({ params: req.params }, res);
  })
  //
);

export { blockRouter };
