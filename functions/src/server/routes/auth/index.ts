import "./validator";
import { auth, getCollectionReference } from "@/firebase";
import { Router } from "express";
import HttpStatusCodes from "@serv/declarations/major/HttpStatusCodes";
import { FieldValue } from "firebase-admin/firestore";
import bcrypt from "bcrypt";
import Validator from "validator-checker-js";
import { sign } from "@serv/utils/jwt";

const router = Router();
export function generateToken(
  id: string,
  data: {
    displayname: string;
    email: string;
    phone: string;
    emailVerified: boolean;
  },
) {
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
});
router.post("/sing-up", async (req, res) => {
  const checkingRes = await registerValidator.asyncPasses(req.body);
  if (!checkingRes.state)
    return res.status(HttpStatusCodes.BAD_REQUEST).sendData({
      success: false,
      msg: "un correct register data",
      err: checkingRes.errors,
    });
  const { email, password, displayName, teacherId, levelId, phone } =
    checkingRes.data;
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
  const token = sign(generateToken(userDoc.id, gData));
  const firebaseToken = await auth.createCustomToken(req.user.id);

  res.cookie("token", token);
  return res.sendData({
    success: true,
    msg: "User registered successfully.",
    data: { user: { ...gData, id: userDoc.id }, firebaseToken },
  });
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
router.post("/login", async (req, res) => {
  const checkingRes = await signInValidator.asyncPasses(req.body);
  if (!checkingRes.state)
    return res.status(HttpStatusCodes.BAD_REQUEST).sendData({
      success: false,
      msg: "un correct register data",
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
      msg: "User registered successfully.",
    });
  const token = generateToken(userDoc.id, resData);
  const firebaseToken = await auth.createCustomToken(req.user.id);

  res.cookie("token", token);
  return res.sendData({
    success: true,
    msg: "User registered successfully.",
    data: { user: { ...userDoc.data(), id: userDoc.id }, firebaseToken },
  });
});
export default router;
