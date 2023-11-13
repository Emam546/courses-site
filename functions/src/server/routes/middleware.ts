import { RequestHandler } from "express";
import { ErrorMessages } from "@serv/declarations/major/Messages";
import HttpStatusCodes from "../declarations/major/HttpStatusCodes";
import { decode } from "@serv/utils/jwt";
import { SetTokens, UserRefreshData } from "./auth/utils";
import { getCollection } from "@/firebase";
export const Auth: RequestHandler = async (req, res, next) => {
  const accessToken = req.cookies.accessToken;
  if (typeof accessToken != "string")
    return res
      .status(HttpStatusCodes.UNAUTHORIZED)
      .sendData({ success: false, msg: ErrorMessages.UnAuthorized });
  try {
    req.user = decode(accessToken);
    return next();
  } catch (error) {
    const refreshToken = req.cookies.refreshToken;
    if (typeof accessToken != "string")
      return res
        .status(HttpStatusCodes.UNAUTHORIZED)
        .sendData({ success: false, msg: ErrorMessages.UnAuthorized });
    try {
      const { id } = decode<UserRefreshData>(refreshToken);
      const doc = await getCollection("Students").doc(id).get();
      const data = doc.data();
      if (!data || !doc.exists)
        return res.status(HttpStatusCodes.UNAUTHORIZED).sendData({
          success: false,
          msg: ErrorMessages.UnAuthorized,
        });
      SetTokens(res, id, data);
      req.user = { id, ...data };
      next();
    } catch (err) {
      return res.status(HttpStatusCodes.UNAUTHORIZED).sendData({
        success: false,
        msg: ErrorMessages.UnAuthorized,
      });
    }
  }
};
