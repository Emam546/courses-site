import "./validator";
import { auth, getCollectionReference, getDocument, storage } from "@/firebase";
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
const registerValidator = new Validator({
  email: ["email", "required"],
  password: ["string", "alpha_num", { min: 5 }, "required"],
  displayName: ["string", "required"],
});
// const api = "https://api.multiavatar.com/4645646";

export const registerTeacher = onCall(async (data) => {
  try {
    const res = await registerValidator.asyncPasses(data);
    if (!res.state)
      return {
        success: false,
        msg: "invalid Data",
        err: res.errors,
      } as RegisterResponseData;
    const { email, password, displayName } = res.data;
    let userRecord: UserRecord;

    try {
      userRecord = await auth.getUserByEmail(email);
      if (userRecord.emailVerified)
        return {
          success: false,
          msg: "the email is already exist",
        };
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
export interface GetInfoRequestData {
  teacherId: string;
}
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
  await storage.bucket().deleteFiles({
    prefix: `Teachers/${doc.id}/`,
  });
  try {
    await auth.deleteUser(doc.id);
  } catch (err) {
    return;
  }
});
export const onTeacherUpdate = teacher.onUpdate(async (doc) => {
  const newData = doc.after.data();
  await auth.updateUser(doc.after.id, {
    displayName: newData.displayName,
    photoURL: newData.photoUrl || null,
    phoneNumber: newData.phone || null,
  });
  if (newData.type != doc.before.data().type)
    await auth.setCustomUserClaims(doc.after.id, { type: newData.type });
});
export const onTeacherCreate = teacher.onCreate(async (doc) => {
  getCollectionReference("TeacherInfo").doc(doc.id).set({});
});
export async function deleteTeacher(user: UserRecord) {
  await getCollectionReference("Teacher").doc(user.uid).delete();
}
