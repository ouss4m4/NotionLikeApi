import asyncHandler from "express-async-handler";
import { Request, Response, Router } from "express";
import { DocumentController } from "../controllers/document.controller";

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

export { documentsRouter };
