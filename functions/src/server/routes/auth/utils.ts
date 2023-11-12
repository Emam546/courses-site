import { auth } from "@/firebase";
import { Response } from "express";
import { sign } from "@serv/utils/jwt";
import EnvVars from "@/server/declarations/major/EnvVars";

export interface UserDecodedData {
  displayname: string;
  email: string;
  phone: string;
  emailVerified: boolean;
}
export function generateToken(id: string, data: UserDecodedData) {
  return {
    id,
    role: "student",
    displayName: data.displayname,
    email: data.email,
    email_verified: data.emailVerified,
    phone: data.phone,
  };
}
export async function authUser(
  res: Response,
  id: string,
  data: UserDecodedData,
) {
  const token = sign(generateToken(id, data), { expiresIn: EnvVars.jwt.exp });
  const firebaseToken = await auth.createCustomToken(id);
  res.cookie("token", token, { maxAge: EnvVars.jwt.exp });
  return res.sendData({
    success: true,
    msg: "User registered successfully.",
    data: { user: { id: id, ...data }, firebaseToken, token },
  });
}
