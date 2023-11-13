import { Response, Request } from "express";
import { sign } from "@serv/utils/jwt";
import EnvVars from "@/server/declarations/major/EnvVars";

export type UserDecodedData = DataBase.WithIdType<
  Omit<DataBase["Students"], "createdAt">
>;
export interface UserRefreshData {
  id: string;
}
export function generateToken(
  id: string,
  data: UserDecodedData,
): Request["user"] {
  return {
    id,
    displayname: data.displayname,
    email: data.email,
    emailVerified: data.emailVerified,
    phone: data.phone,
    teacherId: data.teacherId,
    blocked: data.blocked,
    levelId: data.levelId,
  };
}
export function SetTokens(res: Response, id: string, data: UserDecodedData) {
  res.cookie(
    "accessToken",
    sign(generateToken(id, data), {
      expiresIn: EnvVars.jwt.accessTokenExp,
    }),
    {
      maxAge: 5000,
    },
  );

  res.cookie(
    "refreshToken",
    sign({ id: id }, { expiresIn: EnvVars.jwt.refreshTokenExp }),
    {
      maxAge: EnvVars.jwt.refreshTokenExp,
    },
  );
  return res;
}
export async function authUser(
  res: Response,
  id: string,
  data: UserDecodedData,
) {
  SetTokens(res, id, data);
  return res.sendData({
    success: true,
    msg: "User registered successfully.",
    data: { user: { ...data } },
  });
}
