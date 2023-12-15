import { hasOwnProperty } from "@/utils";
import { firestore } from "@/firebase";
import Validator, { AvailableRules } from "validator-checker-js";
import { MessagesStore } from "validator-checker-js/dist/Rule";

import { isString } from "@/utils/types";

declare module "validator-checker-js/dist/type" {
  interface AvailableRules {
    existedId: {
      type: string;
      path: { existedId: { path: keyof DataBase } };
      errors: MessagesStore<{ existedId: { path: keyof DataBase } }>;
    };
  }
}

Validator.register(
  "existedId",
  (value): value is AvailableRules["existedId"]["path"] => {
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
