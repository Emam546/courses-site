
import { Response, Router } from "express";
import HttpStatusCodes from "@serv/declarations/major/HttpStatusCodes";
import { FieldValue } from "firebase-admin/firestore";
import Validator from "validator-checker-js";
import { decode, sign } from "@serv/utils/jwt";
import { ErrorMessages, Messages } from "@/server/declarations/major/Messages";
import { verifyEmail, UserData, decodeEmail } from "./sender";
import { authUser } from "./utils";
import { createStudent } from "@/server/utils/auth";
const router = Router();
export interface UserSingData {
  displayname: string;
  email: string;
  phone: string;
  emailVerified: boolean;
}

const registerValidator = new Validator({
  email: [
    "email",
    "required",
    { emailStudent: { teacherId: true, exist: false } },
  ],
  password: ["string", "alpha_num", { min: 5 }, "required"],
  teacherId: ["required", "string", { existedId: { path: "Teacher" } }],
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
  const emailCheck = await new Validator({}).validate(email, {
    emailStudent: { teacherId: teacherId, exist: false },
  });
  if (emailCheck)
    return res.status(HttpStatusCodes.BAD_REQUEST).sendData({
      success: false,
      msg: "this email is already verified",
    });

  const gData = {
    displayname: displayName,
    blocked: null,
    email: email,
    phone: phone,
    createdAt: FieldValue.serverTimestamp() as any,
    levelId: levelId,
    teacherId: teacherId,
    emailVerified: true,
  };
  const userDoc = await createStudent(gData, password);
  return await authUser(res, { ...gData, id: userDoc.id });
});
router.get("/logout", async (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.sendData({
    success: true,
    data: null,
    msg: Messages.DataSuccess,
  });
});
export default router;
