import { Response, Request } from "express";
import { sign } from "@serv/utils/jwt";
import EnvVars from "@serv/declarations/major/EnvVars";
import { hasOwnProperty } from "@/utils";
import { getCollection } from "@/firebase";
import HttpStatusCodes from "@serv/declarations/major/HttpStatusCodes";
import { ErrorMessages } from "@serv/declarations/major/Messages";
import { RouteError } from "@serv/declarations/classes";

export type UserDecodedData = DataBase.WithIdType<DataBase["Students"]> & {
  teacherBlockState: boolean;
};
export type TeacherEncodedData = DataBase.WithIdType<DataBase["Teacher"]>;
export interface UserRefreshData {
  id: string;
}
export function generateToken(
  user: DataBase.WithIdType<DataBase["Students"]>,
  teacher: TeacherEncodedData,
): Request["user"] {
  if (hasOwnProperty(user, "email")) {
    return {
      id: user.id,
      displayname: user.displayname,
      email: user.email,
      emailVerified: user.emailVerified,
      phone: user.phone,
      teacherId: user.teacherId,
      blocked: user.blocked,
      levelId: user.levelId,
      createdAt: user.createdAt,
      teacherBlockState: teacher.blocked ? true : false,
    };
  }
  return {
    id: user.id,
    displayname: user.displayname,
    userName: user.userName,
    phone: user.phone,
    teacherId: user.teacherId,
    blocked: user.blocked,
    levelId: user.levelId,
    createdAt: user.createdAt,
    teacherBlockState: teacher.blocked ? true : false,
    creatorId: user.creatorId,
  };
}
export async function SetTokens(
  res: Response,
  user: DataBase.WithIdType<DataBase["Students"]>,
) {
  const teacher = await getCollection("Teacher").doc(user.teacherId).get();
  const teacherData = teacher.data();

  if (!teacherData)
    throw new RouteError(HttpStatusCodes.NOT_FOUND, ErrorMessages.UnExistedDoc);
  const generatedData = generateToken(user, { ...teacherData, id: teacher.id });
  res.cookie(
    "accessToken",
    sign(generateToken(user, { ...teacherData, id: teacher.id }), {
      expiresIn: EnvVars.jwt.accessTokenExp,
    }),
    {
      maxAge: EnvVars.jwt.accessTokenExp,
    },
  );

  res.cookie(
    "refreshToken",
    sign({ id: user.id }, { expiresIn: EnvVars.jwt.refreshTokenExp }),
    {
      maxAge: EnvVars.jwt.refreshTokenExp,
    },
  );
  return generatedData;
}
export async function authUser(
  res: Response,
  data: DataBase.WithIdType<DataBase["Students"]>,
) {
  const teacher = await getCollection("Teacher").doc(data.teacherId).get();
  const teacherData = teacher.data();
  if (!teacherData)
    return res.status(HttpStatusCodes.NOT_FOUND).sendData({
      success: false,
      msg: ErrorMessages.UnExistedDoc,
    });
  await SetTokens(res, data);
  return res.sendData({
    success: true,
    msg: "User registered successfully.",
    data: { user: { ...data } },
  });
}
