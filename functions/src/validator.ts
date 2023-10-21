import { hasOwnProperty } from "./utils";
import { firestore, auth } from "./firebase";
import Validator from "validator-checker-js";
import { MessagesStore } from "validator-checker-js/dist/Rule";
import { DataBase } from "@dataBase";
import { isString } from "./utils/types";

declare module "validator-checker-js/dist/type" {
  interface AvailableRules {
    role: {
      type: string;
      path: { role: string };
      errors: MessagesStore<{ role: string }>;
    };
    existedId: {
      type: string;
      path: { existedId: { path: keyof DataBase } };
      errors: MessagesStore<{ path: keyof DataBase }>;
    };
  }
}
export const roleRule = Validator.register<
  { role: string },
  MessagesStore<{ role: string }>
>(
  "role",
  (value): value is { role: string } => {
    return hasOwnProperty(value, "role") && isString(value.role);
  },
  async (teacherId, data) => {
    if (!isString(teacherId)) return "the userId is not a string";
    const state =
      (await auth.getUser(teacherId)).customClaims?.role == data.role;
    if (!state) return `the userId is not belonged to the ${data.role}`;
    return undefined;
  },
  {},
);
export const existIdRole = Validator.register<
  { existedId: { path: keyof DataBase } },
  MessagesStore<{ existedId: { path: keyof DataBase } }>
>(
  "existedId",
  (value): value is { existedId: { path: keyof DataBase } } => {
    return (
      hasOwnProperty(value, "existedId") &&
      hasOwnProperty(value.existedId, "path") &&
      isString(value.existedId.path)
    );
  },
  async (id, data) => {
    if (!isString(id)) return "the id is not a string";
    const res = await firestore.collection(data.existedId.path).doc(id).get();

    if (!res.exists) return `the id is not exist in ${data.existedId.path}`;
    return undefined;
  },
  {},
);
