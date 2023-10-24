import { auth } from "@/firebase";
import Validator from "validator-checker-js";
import { MessagesStore } from "validator-checker-js/dist/Rule";
import { isString } from "@/utils/types";

declare module "validator-checker-js/dist/type" {
  interface AvailableRules {
    emailNotExist: {
      type: string;
      path: "emailNotExist";
      errors: MessagesStore<"emailNotExist">;
    };
    emailExist: {
      type: string;
      path: "emailExist";
      errors: MessagesStore<"emailExist">;
    };
  }
}
Validator.register(
  "emailExist",
  "emailExist",
  async (email) => {
    if (!isString(email)) return "the email is not a string";
    return await new Promise((res) => {
      auth
        .getUserByEmail(email)
        .then((user) => {
          user.emailVerified ? res(undefined) : res("the email is not exist");
        })
        .catch(() => res("the email is not exist"));
    });
  },
  {},
);
Validator.register(
  "emailNotExist",
  "emailNotExist",
  async (email) => {
    if (!isString(email)) return "the email is not a string";
    return await new Promise((res) => {
      auth
        .getUserByEmail(email)
        .then((user) => {
          user.emailVerified ? res("the email is exist") : res(undefined);
        })
        .catch(() => res(undefined));
    });
  },
  {},
);
