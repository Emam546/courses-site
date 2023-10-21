/* eslint-disable indent */
import * as authfn from "firebase-functions/v1/auth";
import { deleteTeacher } from "./teacher";
import { deleteStudent } from "./user";

export const onAccountDeleted = authfn.user().onDelete(async (user) => {
  switch (user.customClaims?.role) {
    case "teacher":
      await deleteTeacher(user);
      break;
    case "student":
      await deleteStudent(user);
      break;

    default:
      break;
  }
});
