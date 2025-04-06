import { Request, Response, Router } from "express";
import asyncHandler from "express-async-handler";
import { WorkspaceController } from "../controllers/workspace.controller";

const workSpaceRouter = Router();

workSpaceRouter.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    await WorkspaceController.getWorkspace({ body: req.body }, res);
  })
);

workSpaceRouter.post(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    await WorkspaceController.createWorkspace({ body: req.body }, res);
  })
);

workSpaceRouter.get(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    await WorkspaceController.getWorkspaceById({ params: req.params }, res);
  })
);

workSpaceRouter.put(
  "/:id",
  asyncHandler(async (req: Request, res: Response) => {
    await WorkspaceController.updateWorkspaceById({ params: req.params, body: req.body }, res);
  })
);

// WORKSPACE MEMBER ROUTES

workSpaceRouter.post(
  "/:id/members",
  asyncHandler(async (req: Request, res: Response) => {
    await WorkspaceController.addMember({ params: req.params, body: req.body }, res);
  })
);

workSpaceRouter.put(
  "/:id/members",
  asyncHandler(async (req: Request, res: Response) => {
    await WorkspaceController.editMemberRole({ params: req.params, body: req.body }, res);
  })
);

workSpaceRouter.delete(
  "/:id/members/:userId",
  asyncHandler(async (req: Request, res: Response) => {
    await WorkspaceController.removeMember({ params: req.params }, res);
  })
);

export { workSpaceRouter };
