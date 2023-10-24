import "./validator";
import { auth, getCollectionReference, getDocument } from "@/firebase";
import { FieldValue } from "firebase-admin/firestore";
import { onCall } from "firebase-functions/v1/https";
import { UserRecord } from "firebase-admin/auth";
import logger from "firebase-functions/logger";
import { ResponseData } from "@/types";
import Validator from "validator-checker-js";
export type RegisterResponseData = ResponseData<{ token: string }>;
export interface RegisterRequestData {
  email: string;
  password: string;
  displayName: string;
}
const validator = new Validator({
  email: ["email", "required"],
  password: ["string", "alpha_num", { min: 5 }, "required"],
  displayName: ["string", "required"],
});
export const registerTeacher = onCall(async (data) => {
  try {
    const res = await validator.asyncPasses(data);
    if (!res.state)
      return {
        success: false,
        msg: "invalid Data",
        err: res.errors,
      } as RegisterResponseData;
    const { email, password, displayName } = res.data;
    let userRecord = await auth.createUser({
      email,
      password,
      displayName,
    });
    try {
      userRecord = await auth.getUserByEmail(email);

      userRecord = await auth.updateUser(userRecord.uid, {
        email,
        password,
        displayName,
      });
    } catch (err) {
      userRecord = await auth.createUser({
        email,
        password,
        displayName,
      });
    }
    // Create the user in Firebase Authentication

    await auth.setCustomUserClaims(userRecord.uid, { role: "teacher" });
    await getCollectionReference("Teacher").doc(userRecord.uid).set({
      createdAt: FieldValue.serverTimestamp(),
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
const teacher = getDocument("Teacher");
export const onTeacherDelete = teacher.onDelete(async (doc) => {
  const levels = await getCollectionReference("Levels")
    .where("teacherId", "==", doc.id)
    .orderBy("order")
    .get();
  await Promise.all(levels.docs.map((level) => level.ref.delete()));
  const res = await getCollectionReference("Students")
    .where("teacherId", "==", doc.id)
    .get();
  await Promise.all(res.docs.map((doc) => doc.ref.delete()));
});
export async function deleteTeacher(user: UserRecord) {
  await getCollectionReference("Teacher").doc(user.uid).delete();
}
