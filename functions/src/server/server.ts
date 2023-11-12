/* eslint-disable @typescript-eslint/no-namespace */
import express, { Request, RequestHandler, Response } from "express";
import * as logger from "firebase-functions/logger";
import "express-async-errors";
import HttpStatusCodes from "@serv/declarations/major/HttpStatusCodes";
import { RouteError } from "@serv/declarations/classes";
import cookieParser, { CookieParseOptions } from "cookie-parser";
import router from "@serv/routes";
import cors from "cors";
import EnvVars from "./declarations/major/EnvVars";
const app = express();
app.use((req, res, next) => {
  res.sendData = res.json;
  next();
});
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api", router);
app.use((req, res) => {
  res.status(HttpStatusCodes.NOT_FOUND).sendData({
    success: false,
    msg: "non-existed route",
  });
});
app.use(((err: Error, req: Request, res: Response) => {
  logger.error(err);
  let status = HttpStatusCodes.BAD_REQUEST;
  if (err instanceof RouteError) {
    status = err.status;
  }
  return res.status(status).json({ success: false, msg: err.message });
}) as unknown as RequestHandler);

export default app;
