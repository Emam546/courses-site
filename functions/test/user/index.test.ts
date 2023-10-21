import { admin } from "../utils";
import { registerStudent } from "@/user";
import { funcTest, uuid } from "../utils";
import { createUserSignupData } from ".";
import { expect } from "chai";
import { faker } from "@faker-js/faker";
import { UserRecord } from "firebase-admin/auth";

describe("UsersTeachers", () => {
  let teacher: UserRecord;
  const levelDoc = admin.firestore().collection("Levels").doc(uuid());
  beforeAll(async () => {
    const data = {
      displayName: faker.internet.displayName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      emailVerified: true,
    };
    await levelDoc.set({
      teacherId: "teacher id",
    });
  });

});
