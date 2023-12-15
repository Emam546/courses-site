/* eslint-disable indent */
import { getCollectionReference } from "@/firebase";
import Validator, { AvailableRules, MessagesStore } from "validator-checker-js";
import { hasOwnProperty } from "@/utils";
import { isString } from "@/utils/types";
import { getValue } from "validator-checker-js/dist/utils/getValue";
import bcrypt from "bcrypt";
declare module "validator-checker-js/dist/type" {
  interface AvailableRules {
    NotExistEmailStudent: {
      type: string;
      path: { emailStudent: { teacherId: string | true; exist: false } };
      errors: MessagesStore<{
        emailStudent: { teacherId: string | true; exist: false };
      }>;
    };
    ExistEmailStudent: {
      type: string;
      path: { emailStudent: { teacherId: string | true; exist: true } };
      errors: MessagesStore<{
        emailStudent: { teacherId: string | true; exist: true };
      }>;
    };
    passwordStudent: {
      type: string;
      path: {
        passwordStudent: {
          teacherId: string | true;
          email?: string | true;
          userName?: string | true;
        };
      };
      errors: MessagesStore<{
        passwordStudent: {
          teacherId: string | true;
          email?: string | true;
          userName?: string | true;
        };
      }>;
    };
    userNameExist: {
      type: string;
      path: { userNameStudent: { teacherId: string | true; exist: true } };
      errors: MessagesStore<{
        userNameStudent: { teacherId: string | true; exist: true };
      }>;
    };
    userNameNotExist: {
      type: string;
      path: { userNameStudent: { teacherId: string | true; exist: false } };
      errors: MessagesStore<{
        userNameStudent: { teacherId: string | true; exist: false };
      }>;
    };
  }
}
Validator.register<"NotExistEmailStudent">(
  "NotExistEmailStudent",
  (value): value is AvailableRules["NotExistEmailStudent"]["path"] => {
    return (
      hasOwnProperty(value, "emailStudent") &&
      hasOwnProperty(value.emailStudent, "teacherId") &&
      (isString(value.emailStudent.teacherId) ||
        value.emailStudent.teacherId == true) &&
      hasOwnProperty(value.emailStudent, "exist") &&
      value.emailStudent.exist == false
    );
  },
  async (email, data, path, input) => {
    if (!isString(email)) return "the email is not a string";
    let teacherId: string;
    if (data.emailStudent.teacherId == true)
      teacherId = getValue(
        input,
        `${path.split(".").slice(0, -1).join(".")}.teacherId`,
      ) as string;
    else teacherId = data.emailStudent.teacherId;
    const res = await getCollectionReference("Students")
      .where("email", "==", email)
      .where("teacherId", "==", teacherId)
      .limit(1)
      .get();
    if (!res.empty) return "the email is already exist";
    return undefined;
  },
  {},
);
Validator.register<"ExistEmailStudent">(
  "ExistEmailStudent",
  (value): value is AvailableRules["ExistEmailStudent"]["path"] => {
    return (
      hasOwnProperty(value, "emailStudent") &&
      hasOwnProperty(value.emailStudent, "teacherId") &&
      (isString(value.emailStudent.teacherId) ||
        value.emailStudent.teacherId == true) &&
      hasOwnProperty(value.emailStudent, "exist") &&
      value.emailStudent.exist == true
    );
  },
  async (email, data, path, input) => {
    if (!isString(email)) return "the email is not a string";
    let teacherId: string;
    if (data.emailStudent.teacherId == true)
      teacherId = getValue(
        input,
        `${path.split(".").slice(0, -1).join(".")}.teacherId`,
      ) as string;
    else teacherId = data.emailStudent.teacherId;
    const res = await getCollectionReference("Students")
      .where("email", "==", email)
      .where("emailVerified", "==", true)
      .where("teacherId", "==", teacherId)
      .limit(1)
      .get();
    if (res.empty) return "the email is not exist";
    return undefined;
  },
  {},
);
Validator.register<"passwordStudent">(
  "passwordStudent",
  (value): value is AvailableRules["passwordStudent"]["path"] => {
    return (
      hasOwnProperty(value, "passwordStudent") &&
      hasOwnProperty(value.passwordStudent, "teacherId") &&
      (isString(value.passwordStudent.teacherId) ||
        value.passwordStudent.teacherId == true) &&
      ((hasOwnProperty(value.passwordStudent, "email") &&
        (isString(value.passwordStudent.email) ||
          value.passwordStudent.email == true)) ||
        (hasOwnProperty(value.passwordStudent, "userName") &&
          (isString(value.passwordStudent.userName) ||
            value.passwordStudent.userName == true)))
    );
  },
  async (password, data, path, input) => {
    if (!isString(password)) return "the email is not a string";
    let teacherId: string;
    if (data.passwordStudent.teacherId == true)
      teacherId = getValue(
        input,
        `${path.split(".").slice(0, -1).join(".")}.teacherId`,
      ) as string;
    else teacherId = data.passwordStudent.teacherId;
    let email: string | undefined;
    let userName: string | undefined;
    if (data.passwordStudent.email == true)
      email = getValue(
        input,
        `${path.split(".").slice(0, -1).join(".")}.email`,
      ) as string;
    else email = data.passwordStudent.email;
    if (data.passwordStudent.userName == true)
      userName = getValue(
        input,
        `${path.split(".").slice(0, -1).join(".")}.userName`,
      ) as string;
    else userName = data.passwordStudent.userName;
    const res = email
      ? await getCollectionReference("Students")
          .where("email", "==", email)
          .where("teacherId", "==", teacherId)
          .limit(1)
          .get()
      : userName
      ? await getCollectionReference("Students")
          .where("userName", "==", userName)
          .where("teacherId", "==", teacherId)
          .limit(1)
          .get()
      : undefined;
    if (!res) return "You did't provide a username or an email in the data";
    if (res.empty) return undefined;
    const authRes = await getCollectionReference("AuthStudent")
      .doc(res.docs[0].id)
      .get();
    const gData = authRes.data();
    if (!authRes.exists || !gData)
      return "the password authintication document is not exist";
    const state = bcrypt.compareSync(password, gData.passwordHash);
    if (!state) return "the password is not correct";
    return undefined;
  },
  {},
);
Validator.register(
  "userNameExist",
  (value): value is AvailableRules["userNameExist"]["path"] => {
    return (
      hasOwnProperty(value, "userNameStudent") &&
      hasOwnProperty(value.userNameStudent, "teacherId") &&
      (isString(value.userNameStudent.teacherId) ||
        value.userNameStudent.teacherId == true) &&
      hasOwnProperty(value.userNameStudent, "exist") &&
      value.userNameStudent.exist == true
    );
  },
  async (userName, data, path, input) => {
    if (!isString(userName)) return "the UserName is not a string";
    let teacherId: string;
    if (data.userNameStudent.teacherId == true)
      teacherId = getValue(
        input,
        `${path.split(".").slice(0, -1).join(".")}.teacherId`,
      ) as string;
    else teacherId = data.userNameStudent.teacherId;
    const res = await getCollectionReference("Students")
      .where("userName", "==", userName)
      .where("teacherId", "==", teacherId)
      .limit(1)
      .get();
    if (res.empty) return "the userName is not exist";
    return undefined;
  },
  {},
);
Validator.register(
  "userNameNotExist",
  (value): value is AvailableRules["userNameNotExist"]["path"] => {
    return (
      hasOwnProperty(value, "userNameStudent") &&
      hasOwnProperty(value.userNameStudent, "teacherId") &&
      (isString(value.userNameStudent.teacherId) ||
        value.userNameStudent.teacherId == true) &&
      hasOwnProperty(value.userNameStudent, "exist") &&
      value.userNameStudent.exist == false
    );
  },
  async (userName, data, path, input) => {
    if (!isString(userName)) return "the email is not a string";
    let teacherId: string;
    if (data.userNameStudent.teacherId == true)
      teacherId = getValue(
        input,
        `${path.split(".").slice(0, -1).join(".")}.teacherId`,
      ) as string;
    else teacherId = data.userNameStudent.teacherId;
    const res = await getCollectionReference("Students")
      .where("userName", "==", userName)
      .where("teacherId", "==", teacherId)
      .limit(1)
      .get();
    if (!res.empty) return "the userName is already exist";
    return undefined;
  },
  {},
);
