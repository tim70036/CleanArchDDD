import express from "express";
import { authRouter } from "./Auth";

const apiRouter = express.Router();
apiRouter.use("/auth", authRouter);

export { apiRouter };
