/* eslint-disable indent */
import * as authfn from "firebase-functions/v1/auth";
import { deleteTeacher } from "./teacher";

export const onAccountDeleted = authfn.user().onDelete(async (user) => {
  await deleteTeacher(user);
});
