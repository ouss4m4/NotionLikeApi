import { Request, Response, Router } from "express";
import userRouter from "./userRouter";

const apiV1Router = Router();

apiV1Router.use("/users", userRouter);

apiV1Router.use("/", (_, res: Response) => {
  res.redirect("/");
});

export { apiV1Router };
