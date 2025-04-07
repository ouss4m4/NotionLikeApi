import asyncHandler from "express-async-handler";
import { Request, Response, Router } from "express";
import { DocumentController } from "../controllers/document.controller";
import { BlockController } from "../controllers/block.controller";

const documentsRouter = Router();

documentsRouter.get("/", async (_, res: Response) => {
  await DocumentController.getDocuments(res);
});

documentsRouter.post(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    await DocumentController.createDocument({ body: req.body }, res);
  })
);

documentsRouter.put("/:id", async (req: Request, res: Response) => {
  await DocumentController.updateDocument({ params: req.params, body: req.body }, res);
});

documentsRouter.get(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    await DocumentController.getDocumentById({ params: req.params }, res);
  })
);

documentsRouter.get(
  "/:id/blocks",
  asyncHandler(async (req: Request, res: Response) => {
    await BlockController.getBlocksByDocumentId({ params: req.params }, res);
  })
);

documentsRouter.get(
  "/:id/full",
  asyncHandler(async (req: Request, res: Response) => {
    await DocumentController.getFullDocument({ params: req.params }, res);
  })
);

documentsRouter.delete(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    await DocumentController.deleteDocument({ params: req.params }, res);
  })
  // 67f386a053b19da192d0bf4e
);

export { documentsRouter };
