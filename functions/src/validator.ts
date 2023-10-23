import { hasOwnProperty } from "./utils";
import { firestore, auth } from "./firebase";
import Validator from "validator-checker-js";
import { getValue } from "validator-checker-js/dist/utils/getValue";
import { MessagesStore } from "validator-checker-js/dist/Rule";
import { DataBase } from "@dataBase";
import bcrypt from "bcrypt";
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
    checkPassword: {
      type: string;
      path: "checkPassword";
      errors: MessagesStore<"checkPassword">;
    };
  }
}
Validator.register<"role">(
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
Validator.register<"existedId">(
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
          user.emailVerified ? res("the email is not exist") : res(undefined);
        })
        .catch(() => res(undefined));
    });
  },
  {},
);
Validator.register(
  "checkPassword",
  "checkPassword",
  async (password, _, path, input) => {
    if (!isString(password)) return "the password is not a string";
    const sourcePath = path.split(".").slice(0, -2).join(".");
    const email = getValue(input, `${sourcePath}.email`);
    if (!isString(email)) return;

    return await new Promise((res) => {
      auth
        .getUserByEmail(email)
        .then((user) => {
          const isPasswordValid = bcrypt.compareSync(
            password,
            user.passwordHash!,
          );
          if (!isPasswordValid) return res("The password is not valid");
        })
        .catch(() => res(undefined));
    });
  },
  {},
);
