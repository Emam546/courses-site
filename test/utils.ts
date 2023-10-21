import * as firebase from "@firebase/testing";
export { v4 as uuid } from "uuid";
import { v4 as uuid } from "uuid";
export const PROJECT_ID = "coursessite-d6e57";
export function getApp(auth?: object) {
    return firebase.initializeTestApp({ projectId: PROJECT_ID, auth });
}
export function getAppAdmin() {
    return firebase.initializeAdminApp({ projectId: PROJECT_ID });
}
export function getFireStore(auth?: object) {
    return getApp(auth).firestore();
}
export function getAuth(auth?: object) {
    return getApp(auth).auth();
}
export function getFunctions(auth?: object) {
    return getApp(auth).functions();
}
export const CreateAuth = (id?: string) => ({
    uid: id || uuid(),
    email: "email@gmail.com",
    email_verified: true,
    role: "teacher",
});

export const InitialAuth = CreateAuth(uuid());
