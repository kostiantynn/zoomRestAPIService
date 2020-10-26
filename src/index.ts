import express, { Request, Response } from "express";
require("dotenv").config();

(async () => {
  const app = express();

  const apiRouter = require("./routes/api");

  app.use("/api", apiRouter);

  app.all("/", (_req: Request, res: Response) => {
    res.writeHead(301, { Location: "/api" });
    res.end();
  });

  app.listen(3000, () => console.log("Server has started."));
})();
