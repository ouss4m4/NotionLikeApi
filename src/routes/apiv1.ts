import { Request, Response, Router } from "express";
import userRouter from "./user.router";
import { workSpaceRouter } from "./workspace.router";
import { documentsRouter } from "./document.router";
import { blockRouter } from "./block.router";

const apiV1Router = Router();

apiV1Router.use("/users", userRouter);
apiV1Router.use("/workspaces", workSpaceRouter);
apiV1Router.use("/documents", documentsRouter);
apiV1Router.use("/blocks", blockRouter);

// apiV1Router.use("/", (_, res: Response) => {
//   res.redirect("/");
// });

export { apiV1Router };
