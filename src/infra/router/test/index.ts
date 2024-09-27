import express from "express";

const testRouter = express.Router();

testRouter.get("/ping", (req, res) => {
  PingController(req, res);
});

function PingController(req: express.Request, res: express.Response): void {
  res.status(202).send();
  return;
}

export { testRouter };
