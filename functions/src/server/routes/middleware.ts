import { RequestHandler } from "express";
import { ErrorMessages } from "@serv/declarations/major/Messages";
import HttpStatusCodes from "../declarations/major/HttpStatusCodes";
import { decode } from "@serv/utils/jwt";
import { SetTokens, UserRefreshData } from "./auth/utils";
import { getCollection } from "@/firebase";
export const EncodeUser: RequestHandler = async (req, res, next) => {
  try {
    req.user = decode(req.cookies.accessToken);
    return next();
  } catch (error) {
    try {
      const refreshToken = req.cookies.refreshToken;
      const { id } = decode<UserRefreshData>(refreshToken);
      const doc = await getCollection("Students").doc(id).get();
      const data = doc.data();
      if (!data || !doc.exists) return next();
      SetTokens(res, id, { ...data, id });
      req.user = { id, ...data };
      next();
    } catch (err) {
      return next();
    }
  }
};
export const Auth: RequestHandler = async (req, res, next) => {
  if (!req.user)
    return res.status(HttpStatusCodes.UNAUTHORIZED).sendData({
      success: false,
      msg: ErrorMessages.UnAuthorized,
    });
  return next();
};
