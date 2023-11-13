import "./validator";
import { getCollectionReference } from "@/firebase";
import { Response, Router } from "express";
import HttpStatusCodes from "@serv/declarations/major/HttpStatusCodes";
import { FieldValue } from "firebase-admin/firestore";
import bcrypt from "bcrypt";
import Validator from "validator-checker-js";
import { decode, sign } from "@serv/utils/jwt";
import { ErrorMessages, Messages } from "@/server/declarations/major/Messages";
import { verifyEmail, UserData, decodeEmail } from "./sender";
import { authUser } from "./utils";
const router = Router();
export interface UserSingData {
  displayname: string;
  email: string;
  phone: string;
  emailVerified: boolean;
}
export function generateToken(id: string, data: UserSingData) {
  return {
    id,
    role: "student",
    displayName: data.displayname,
    email: data.email,
    email_verified: data.emailVerified,
    phone: data.phone,
  };
}
const registerValidator = new Validator({
  email: [
    "email",
    "required",
    { emailStudent: { teacherId: true, exist: false } },
  ],
  password: ["string", "alpha_num", { min: 5 }, "required"],
  teacherId: ["required", { role: "teacher" }],
  levelId: ["required", { existedId: { path: "Levels" } }, "string"],
  phone: ["string"],
  displayName: ["string", "required"],
  redirectUrl: ["string", "required"],
});
async function setSendEmail(res: Response, data: UserData) {
  await verifyEmail(data);
  res.cookie("verifyToken", sign(data));
  return res.status(HttpStatusCodes.OK).sendData({
    success: true,
    msg: "The Email was sent successfully",
    data: null,
  });
}
router.post("/sing-up", async (req, res) => {
  const checkingRes = await registerValidator.asyncPasses(req.body);
  if (!checkingRes.state) {
    res.status(HttpStatusCodes.BAD_REQUEST).sendData({
      success: false,
      msg: ErrorMessages.InValidData,
      err: checkingRes.errors,
    });
    return;
  }

  await setSendEmail(res, checkingRes.data);
});
const signInValidator = new Validator({
  email: [
    "email",
    "required",
    { emailStudent: { teacherId: true, exist: true } },
  ],
  password: [
    "string",
    "required",
    { passwordStudent: { teacherId: true, email: true } },
  ],
  teacherId: ["string", "required"],
});
router.get("/resendEmail", async (req, res) => {
  const verifyToken = req.cookies.verifyToken;
  if (!verifyToken)
    return res.status(HttpStatusCodes.UNAUTHORIZED).sendData({
      success: false,
      msg: "UnExisted Verified Token",
    });
  const data = decode<UserData>(verifyToken);
  return await setSendEmail(res, data);
});

router.post("/login", async (req, res) => {
  const checkingRes = await signInValidator.asyncPasses(req.body);
  if (!checkingRes.state)
    return res.status(HttpStatusCodes.BAD_REQUEST).sendData({
      success: false,
      msg: ErrorMessages.InValidData,
      err: checkingRes.errors,
    });
  const { email, teacherId } = checkingRes.data;
  const result = await getCollectionReference("Students")
    .where("teacherId", "==", teacherId)
    .where("email", "==", email)
    .limit(1)
    .get();

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
  return await authUser(res, userDoc.id, userDoc.data());
});

router.get("/verify/:emailToken", async (req, res) => {
  const emailToken = req.params.emailToken;
  res.clearCookie("verifyToken");
  let data: UserData;
  try {
    data = decodeEmail(emailToken);
  } catch (error: any) {
    return res.status(HttpStatusCodes.BAD_REQUEST).sendData({
      success: false,
      msg: error.message,
    });
  }
  const { email, password, displayName, teacherId, levelId, phone } = data;
  const emailCheck = await signInValidator.validate(email, {
    emailStudent: { teacherId: teacherId, exist: false },
  });
  if (emailCheck)
    return res.status(HttpStatusCodes.BAD_REQUEST).sendData({
      success: false,
      msg: "this email is already verified",
    });
  
  const gData = {
    displayname: displayName,
    blocked: false,
    email: email,
    phone: phone,
    createdAt: FieldValue.serverTimestamp(),
    levelId: levelId,
    teacherId: teacherId,
    emailVerified: true,
  };
  const userDoc = await getCollectionReference("Students").add(gData);
  const passwordSalt = bcrypt.genSaltSync();
  const passwordHash = bcrypt.hashSync(password, passwordSalt);

  await getCollectionReference("AuthStudent").doc(userDoc.id).set({
    passwordHash,
    passwordSalt,
  });
  return await authUser(res, userDoc.id, gData);
});
router.get("/logout", async (req, res) => {
  res.clearCookie("token");
  res.sendData({
    success: true,
    data: null,
    msg: Messages.DataSuccess,
  });
});
export default router;
