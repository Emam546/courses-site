import { firestore, getCollection, getDocument } from "@/firebase";

import { onCall } from "firebase-functions/v1/https";
import { ResponseData } from "@/types";
import Validator from "validator-checker-js";
import { FieldValue } from "firebase-admin/firestore";
import { createStudent as createStudentServer } from "./server/utils/auth";
import { pattern as UserNamePattern } from "./server/utils/validateUserName";
const user = getDocument("Students");
export type RegisterResponseData = ResponseData<{ id: string }>;
export interface RegisterRequestData {
  userName: string;
  displayname: string;
  phone?: string;
  email?: string;
  teacherId: string;
  levelId: string;
  blocked?: boolean;
}
const registerValidator = new Validator({
  email: ["email", { emailStudent: { teacherId: true, exist: false } }],
  displayname: ["string", "required"],
  userName: [
    "string",
    "required",
    { regExp: UserNamePattern },
    { userNameStudent: { teacherId: true, exist: false } },
  ],
  phone: ["string"],
  blocked: ["boolean"],
  levelId: ["string", "required", { existedId: { path: "Levels" } }],
  teacherId: ["string", "required", { existedId: { path: "Teacher" } }],
});
export const createStudent = onCall(async (data, context) => {
  if (!context.auth)
    return {
      success: false,
      msg: "UnAuthorized",
    } as RegisterResponseData;
  const res = await registerValidator.asyncPasses(data);
  if (!res.state)
    return {
      success: false,
      msg: "invalid Data",
      err: res.errors,
    } as RegisterResponseData;
  const { teacherId, levelId, userName } = res.data;
  const level = await getCollection("Levels").doc(levelId).get();
  if (!level.exists)
    return {
      success: false,
      msg: "The Level is not exist",
    } as RegisterResponseData;
  if (teacherId != level.data()?.teacherId)
    return {
      success: false,
      msg: "You can not add on this level",
    } as RegisterResponseData;
  if (
    !level.data()?.usersAdderIds.includes(context.auth?.uid) &&
    context.auth.uid != level.data()?.teacherId
  )
    return {
      success: false,
      msg: "You can not add on this level",
    } as RegisterResponseData;

  const doc = await createStudentServer(
    {
      ...res.data,
      emailVerified: false,
      blocked: null,
      creatorId: context.auth.uid,
      createdAt: FieldValue.serverTimestamp() as any,
    },
    userName,
  );

  return {
    success: true,
    msg: "Success",
    data: {
      id: doc.id,
    },
  } as RegisterResponseData;
});

export const onUserDelete = user.onDelete(async (doc) => {
  await firestore.collection("AuthStudent").doc(doc.id).delete();
  const results = await firestore
    .collection("Results")
    .where("userId", "==", doc.id)
    .get();
  await Promise.all(results.docs.map((doc) => doc.ref.delete()));
});
