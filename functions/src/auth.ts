/* eslint-disable indent */
import * as authfn from "firebase-functions/v1/auth";
import { deleteTeacher } from "./teacher";
import { FieldValue } from "firebase-admin/firestore";
import { auth, getCollectionReference } from "@/firebase";

export const onAccountCreate = authfn.user().onCreate(async (user) => {
  await auth.setCustomUserClaims(user.uid, { type: "assistant" });
  await getCollectionReference("Teacher")
    .doc(user.uid)
    .set({
      createdAt: FieldValue.serverTimestamp(),
      blocked: null,
      type: "assistant",
      email: user.email || "",
      displayName: user.displayName || "",
      photoUrl: user.photoURL,
      phone: user.phoneNumber,
    });
});
export const onAccountDeleted = authfn.user().onDelete(async (user) => {
  await deleteTeacher(user);
});
