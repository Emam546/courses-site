import "./validator";
import { FieldValue } from "firebase-admin/firestore";
import {
  firestore,
  auth,
  getCollectionReference,
  getDocument,
} from "@/firebase";
import { onCall } from "firebase-functions/v1/https";
import { ResponseData } from "@/types";
import Validator from "validator-checker-js";
import bcrypt from "bcrypt";
const user = getDocument("Students");

export type RegisterResponseData = ResponseData<{ token: string }>;
export interface RegisterRequestData {
  email: string;
  password: string;
  displayName: string;
  teacherId: string;
  levelId: string;
  phone: string;
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
export async function generateToken(
  id: string,
  data: {
    displayname: string;
    email: string;
    phone: string;
    emailVerified: boolean;
  },
) {
  return await auth.createCustomToken(id, {
    role: "student",

    displayName: data.displayname,
    email: data.email,
    emailVerified: data.emailVerified,
    phone: data.phone,
  });
}
export const registerStudent = onCall(async (data) => {
  const checkingRes = await registerValidator.asyncPasses(data);
  if (!checkingRes.state)
    return {
      success: false,
      msg: "un correct register data",
      err: checkingRes.errors,
    } as RegisterResponseData;
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
    emailVerified: false,
  };
  const userDoc = await getCollectionReference("Students").add(gData);
  const passwordSalt = bcrypt.genSaltSync();
  const passwordHash = bcrypt.hashSync(password, passwordSalt);
  await getCollectionReference("AuthStudent").doc(userDoc.id).set({
    passwordHash,
    passwordSalt,
  });
  const token = await generateToken(userDoc.id, gData);
  return {
    success: true,
    msg: "User registered successfully.",
    data: { token },
  } as RegisterResponseData;
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

export const signInStudent = onCall(async (data) => {
  const checkingRes = await signInValidator.asyncPasses(data);
  if (!checkingRes.state)
    return {
      success: false,
      msg: "un correct register data",
      err: checkingRes.errors,
    } as RegisterResponseData;
  const { email, teacherId } = checkingRes.data;
  const res = await getCollectionReference("Students")
    .where("teacherId", "==", teacherId)
    .where("email", "==", email)
    .limit(1)
    .get();
  const userDoc = res.docs[0];
  const resData = userDoc.data();
  if (!resData)
    return {
      success: false,
      msg: "User registered successfully.",
    };
  const token = await generateToken(userDoc.id, resData);
  return {
    success: true,
    msg: "User registered successfully.",
    data: { token },
  } as RegisterResponseData;
});

export const onUserDelete = user.onDelete(async (doc) => {
  const results = await firestore
    .collection("Results")
    .where("userId", "==", doc.id)
    .orderBy("startAt")
    .get();
  await Promise.all(results.docs.map((doc) => doc.ref.delete()));
});
