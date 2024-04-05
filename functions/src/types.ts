import { Send } from "express";
import { UserDecodedData } from "@serv/routes/auth/utils";
declare global {
  namespace Express {
    interface Request {
      user: UserDecodedData;
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
