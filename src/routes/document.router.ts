import asyncHandler from "express-async-handler";
import { Request, Response, Router } from "express";
import { DocumentController } from "../controllers/document.controller";
import { BlockController } from "../controllers/block.controller";
import { authenticateJWT } from "../middleware/auth.middleware";

const documentsRouter = Router();

documentsRouter.get("/", authenticateJWT, async (_, res: Response) => {
  await DocumentController.getDocuments(res);
});

documentsRouter.post(
  "/",
  authenticateJWT,
  asyncHandler(async (req: Request, res: Response) => {
    await DocumentController.createDocument({ body: req.body }, res);
  })
);

documentsRouter.put("/:id", async (req: Request, res: Response) => {
  await DocumentController.updateDocument({ params: req.params, body: req.body }, res);
});

documentsRouter.get(
  "/:id",
  authenticateJWT,
  asyncHandler(async (req: Request, res: Response) => {
    await DocumentController.getDocumentById({ params: req.params }, res);
  })
);

documentsRouter.get(
  "/:id/blocks",
  authenticateJWT,
  asyncHandler(async (req: Request, res: Response) => {
    await BlockController.getBlocksByDocumentId({ params: req.params }, res);
  })
);

documentsRouter.get(
  "/:id/full",
  authenticateJWT,
  asyncHandler(async (req: Request, res: Response) => {
    await DocumentController.getFullDocument({ params: req.params }, res);
  })
);

documentsRouter.delete(
  "/:id",
  authenticateJWT,
  asyncHandler(async (req: Request, res: Response) => {
    await DocumentController.deleteDocument({ params: req.params }, res);
  })
  // 67f386a053b19da192d0bf4e
);

export { documentsRouter };
