import { Send } from "express";
declare global {
  namespace Express {
    interface Request {
      user: DataBase.WithIdType<DataBase["Students"]>;
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
