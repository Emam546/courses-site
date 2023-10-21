import { DecodedIdToken } from "firebase-admin/auth";
import { Send } from "express";
declare global {
  namespace Express {
    interface Request {
      user: DecodedIdToken;
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
