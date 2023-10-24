/* eslint-disable indent */
import * as authfn from "firebase-functions/v1/auth";
import { deleteTeacher } from "./teacher";

export const onAccountDeleted = authfn.user().onDelete(async (user) => {
  switch (user.customClaims?.role) {
    case "teacher":
      await deleteTeacher(user);
      break;
    default:
      break;
  }
});
