import { Response, Request } from "express";
import { sign } from "@serv/utils/jwt";
import EnvVars from "@/server/declarations/major/EnvVars";

export interface UserDecodedData {
  displayname: string;
  email: string;
  phone: string;
  emailVerified: boolean;
  teacherId: string;
}
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
  };
}
export function SetTokens(res: Response, id: string, data: UserDecodedData) {
  const accessToken = sign(generateToken(id, data), {
    expiresIn: EnvVars.jwt.accessTokenExp,
  });
  res.cookie("accessToken", accessToken, {
    maxAge: EnvVars.jwt.accessTokenExp,
  });

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
    data: { user: { id: id, ...data } },
  });
}
