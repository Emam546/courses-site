import { FieldValue } from "firebase-admin/firestore";
import {
  firestore,
  auth,
  getCollectionReference,
  getDocument,
} from "./firebase";
import { onCall } from "firebase-functions/v1/https";
import * as logger from "firebase-functions/logger";
import { ResponseData } from "./types";
import { UserRecord } from "firebase-admin/auth";
import Validator from "validator-checker-js";
const user = getDocument("UsersTeachers");
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
  email: ["email", "required", "emailNotExist"],
  password: ["string", "alpha_num", { min: 5 }, "required"],
  teacherId: ["required", { role: "teacher" }],
  levelId: ["required", { existedId: { path: "Levels" } }, "string"],
  phone: ["string"],
  displayName: ["string", "required"],
});
const singUpStudentValidator = new Validator({
  email: ["required", "emailExist"],
  password: ["checkPassword", "required"],
  teacherId: ["required", { role: "teacher" }],
});

export const registerStudent = onCall(async (data) => {
  try {
    const checkingRes = await registerValidator.asyncPasses(data);
    if (!checkingRes.state)
      return {
        success: false,
        msg: "un correct register data",
        err: checkingRes.errors,
      } as RegisterResponseData;
    const { email, password, displayName, teacherId, levelId, phone } =
      checkingRes.data;
    let userRecord: UserRecord;

    try {
      userRecord = await auth.getUserByEmail(email);
      userRecord = await auth.updateUser(userRecord.uid, {
        email,
        password,
        displayName,
        phoneNumber: phone,
      });
    } catch (err) {
      userRecord = await auth.createUser({
        email,
        password,
        displayName,
        phoneNumber: phone,
      });
    }
    await auth.setCustomUserClaims(userRecord.uid, { role: "student" });
    const userDoc = getCollectionReference("UsersTeachers").doc(
      teacherId + userRecord.uid,
    );
    const res = await userDoc.get();
    if (res.exists)
      return {
        success: false,
        msg: "The User is already exist",
      } as RegisterResponseData;
    await userDoc.set({
      createdAt: FieldValue.serverTimestamp(),
      teacherId,
      blocked: false,
      displayname: displayName,
      email,
      levelId,
      phone,
      userId: userRecord.uid,
    });
    const customToken = await auth.createCustomToken(userRecord.uid);
    return {
      success: true,
      msg: "User registered successfully.",
      data: { token: customToken },
    } as RegisterResponseData;
  } catch (err) {
    logger.error("error", err);
    return {
      success: false,
      msg: "User registered Failed.",
      err,
    } as RegisterResponseData;
  }
});
export const singUpStudent = onCall(async (data) => {
  const checkingRes = await singUpStudentValidator.asyncPasses(data);
  if (!checkingRes.state)
    return {
      success: false,
      msg: "un correct register data",
      err: checkingRes.errors,
    } as RegisterResponseData;
  const { email, teacherId } = checkingRes.data;
  const userRecord = await auth.getUserByEmail(email);

  const userDoc = getCollectionReference("UsersTeachers").doc(
    teacherId + userRecord.uid,
  );
  const res = await userDoc.get();
  if (!res.exists)
    return {
      success: false,
      msg: "The User is not exist",
    } as RegisterResponseData;

  const customToken = await auth.createCustomToken(userRecord.uid);
  return {
    success: true,
    msg: "User registered successfully.",
    data: { token: customToken, user: { id: res.id, ...res.data() } },
  } as RegisterResponseData;
});

export async function deleteStudent(user: UserRecord) {
  const res = await getCollectionReference("UsersTeachers")
    .where("userId", "==", user.uid)
    .get();
  await Promise.all(res.docs.map((doc) => doc.ref.delete()));
}
export const onUserDelete = user.onDelete(async (doc) => {
  const results = await firestore
    .collection("Results")
    .where("userId", "==", doc.data().userId)
    .where("teacherId", "==", doc.data().teacherId)
    .orderBy("startAt")
    .get();
  await Promise.all(results.docs.map((doc) => doc.ref.delete()));
});
