import * as initilize from "firebase-functions-test";
export { v4 as uuid } from "uuid";
export const PROJECT_ID = "coursessite-d6e57";
import { initializeAdminApp } from "@firebase/testing";
import * as service from "../../serviceAccountKey.json";
import { cert } from "firebase-admin/app";
export const funcTest = initilize({
  projectId: PROJECT_ID,
  credential: cert(service as any),
  databaseURL:"http://localhost:8080"
});
export const admin = initializeAdminApp({ projectId: PROJECT_ID });
