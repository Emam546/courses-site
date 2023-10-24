import { Send } from "express";
import { DataBase, WithIdType } from "@dataBase";
declare global {
  namespace Express {
    interface Request {
      user: WithIdType<DataBase["Students"]>;
    }
  }
}
declare module "express-serve-static-core" {
  interface Response {
    sendData: Send<ResponseData<unknown>, this>;
  }
}

export type ResponseData<T> =
  | {
      success: true;
      msg: string;
      data: T;
    }
  | {
      success: false;
      msg: string;
      err?: unknown;
    };
