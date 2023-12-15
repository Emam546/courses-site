/* eslint-disable indent */
import "./validator";
import { getCollectionReference } from "@/firebase";
import { Router } from "express";
import HttpStatusCodes from "@serv/declarations/major/HttpStatusCodes";
import { ErrorMessages } from "@/server/declarations/major/Messages";
import { authUser } from "./utils";
import Validator from "validator-checker-js";
import { RouteError } from "@/server/declarations/classes";
const router = Router();
export interface UserSingData {
  displayname: string;
  email: string;
  phone: string;
  emailVerified: boolean;
}

const signInValidator = new Validator({
  email: [
    "email",
    { required_without: ["userName"] },
    { emailStudent: { teacherId: true, exist: true } },
  ],
  userName: [
    "string",
    { required_without: ["email"] },
    { emailStudent: { teacherId: true, exist: true } },
  ],
  password: [
    "string",
    "required",
    { passwordStudent: { teacherId: true, email: true, userName: true } },
  ],
  teacherId: ["string", "required"],
});
router.post("/login", async (req, res) => {
  const checkingRes = await signInValidator.asyncPasses(req.body);
  if (!checkingRes.state)
    return res.status(HttpStatusCodes.BAD_REQUEST).sendData({
      success: false,
      msg: ErrorMessages.InValidData,
      err: checkingRes.errors,
    });
  const { email, teacherId, userName } = checkingRes.data;

  const result = email
    ? await getCollectionReference("Students")
        .where("teacherId", "==", teacherId)
        .where("email", "==", email)
        .limit(1)
        .get()
    : userName
    ? await getCollectionReference("Students")
        .where("teacherId", "==", teacherId)
        .where("userName", "==", userName)
        .limit(1)
        .get()
    : undefined;
  if (!result)
    throw new RouteError(HttpStatusCodes.BAD_REQUEST, "UnProvided Email");
  const userDoc = result.docs[0];
  const resData = userDoc.data();
  if (!resData)
    return res.status(HttpStatusCodes.BAD_REQUEST).sendData({
      success: false,
      msg: ErrorMessages.InValidData,
    });
  if (resData.blocked)
    return res.status(HttpStatusCodes.FORBIDDEN).sendData({
      success: false,
      msg: ErrorMessages.TEACHER_BLOCK,
    });
  return await authUser(res, {
    id: userDoc.id,
    ...userDoc.data(),
  });
});

export default router;
