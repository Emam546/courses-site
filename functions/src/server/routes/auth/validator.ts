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
          email: string | true;
        };
      };
      errors: MessagesStore<{
        passwordStudent: {
          teacherId: string | true;
          email: string | true;
        };
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
      hasOwnProperty(value.passwordStudent, "email") &&
      (isString(value.passwordStudent.email) ||
        value.passwordStudent.email == true)
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
    let email: string;
    if (data.passwordStudent.email == true)
      email = getValue(
        input,
        `${path.split(".").slice(0, -1).join(".")}.email`,
      ) as string;
    else email = data.passwordStudent.email;
    const res = await getCollectionReference("Students")
      .where("email", "==", email)
      .where("teacherId", "==", teacherId)
      .limit(1)
      .get();
    if (res.empty) return undefined;
    const authRes = await getCollectionReference("AuthStudent")
      .doc(res.docs[0].id)
      .get();
    const gData = authRes.data();
    if (!authRes.exists || !gData)
      return "the password authintication is not exist";
    const state = bcrypt.compareSync(password, gData.passwordHash);
    if (!state) return "the password is not correct";
    return undefined;
  },
  {},
);
