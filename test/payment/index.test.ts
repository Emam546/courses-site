import { createPaymentAdmin } from ".";
import { createCourseData } from "../course";
import {
    CreateAuth,
    getAppAdmin,
    getFireStore,
    InitialAuth,
    uuid,
} from "../utils";
import * as firebase from "@firebase/testing";

describe("Payments", () => {
    const StudentAuth = { ...CreateAuth(), role: "student" };
    const AuthFire = getFireStore(InitialAuth);
    const courseDoc = getAppAdmin()
        .firestore()
        .collection("Courses")
        .doc(uuid());

    const correctAdminData = createPaymentAdmin(
        InitialAuth.uid,
        StudentAuth.uid,
        courseDoc.id
    );
    beforeAll(async () => {
        await courseDoc.set(createCourseData(uuid()));
    });
    afterAll(async () => {
        await courseDoc.delete();
    });
    describe("create", () => {
        test("authorized create", async () => {
            const query = AuthFire.collection("Payments").add(correctAdminData);
            await firebase.assertSucceeds(query);
        });
        test("unauthorized create", async () => {
            const query = getFireStore()
                .collection("Payments")
                .add(correctAdminData);
            await firebase.assertFails(query);
        });
        test("student create", async () => {
            const query = getFireStore(StudentAuth)
                .collection("Payments")
                .add(correctAdminData);
            await firebase.assertFails(query);
        });
        test("existed student", async () => {
            const query = getFireStore(StudentAuth)
                .collection("Payments")
                .add({
                    ...correctAdminData,
                    userId: "unExisted student",
                });
            await firebase.assertFails(query);
        });
        test("existed student but unlisted", async () => {
            const query = AuthFire.collection("Payments").add({
                ...correctAdminData,
                userId: uuid(),
            });
            await firebase.assertSucceeds(query);
        });
        test("non-existed type", async () => {
            const query = getFireStore(StudentAuth)
                .collection("Payments")
                .add({
                    ...correctAdminData,
                    type: "wrong type",
                });
            await firebase.assertFails(query);
        });
        describe("Wrong", () => {
            describe("admin", () => {
                test("unprovided", async () => {
                    const query = getFireStore(StudentAuth)
                        .collection("Payments")
                        .add({
                            ...correctAdminData,
                            activatedAt: null,
                        });
                    await firebase.assertFails(query);
                });
            });
        });
    });
    describe("delete", () => {
        const doc = getAppAdmin()
            .firestore()
            .collection("Payments")
            .doc(uuid());
        beforeEach(async () => {
            await doc.set(
                createPaymentAdmin(
                    InitialAuth.uid,
                    StudentAuth.uid,
                    courseDoc.id
                )
            );
        });
        afterAll(async () => {
            await doc.delete();
        });
        test("authorized read", async () => {
            const query = AuthFire.collection("Payments").doc(doc.id).delete();
            await firebase.assertSucceeds(query);
        });
        test("unauthorized read", async () => {
            const query = getFireStore()
                .collection("Payments")
                .doc(doc.id)
                .delete();
            await firebase.assertFails(query);
        });
        test("student delete", async () => {
            const query = getFireStore(StudentAuth)
                .collection("Payments")
                .doc(doc.id)
                .delete();
            await firebase.assertFails(query);
        });
        test("wrong student delete", async () => {
            const query = getFireStore({ ...CreateAuth(), role: "student" })
                .collection("Payments")
                .doc(doc.id)
                .delete();
            await firebase.assertFails(query);
        });
        test("wrong teacher delete", async () => {
            const query = getFireStore(CreateAuth())
                .collection("Payments")
                .doc(doc.id)
                .delete();
            await firebase.assertFails(query);
        });
    });
    describe("read", () => {
        const doc = getAppAdmin()
            .firestore()
            .collection("Payments")
            .doc(uuid());
        beforeAll(async () => {
            await doc.set(
                createPaymentAdmin(
                    InitialAuth.uid,
                    StudentAuth.uid,
                    courseDoc.id
                )
            );
        });
        afterAll(async () => {
            await doc.delete();
        });
        test("authorized read", async () => {
            const query = AuthFire.collection("Payments").doc(doc.id).get();
            await firebase.assertSucceeds(query);
        });
        test("unauthorized read", async () => {
            const query = getFireStore()
                .collection("Payments")
                .doc(doc.id)
                .get();
            await firebase.assertFails(query);
        });
        test("student read", async () => {
            const query = getFireStore(StudentAuth)
                .collection("Payments")
                .doc(doc.id)
                .get();
            await firebase.assertSucceeds(query);
        });
        test("wrong student read", async () => {
            const query = getFireStore({ ...CreateAuth(), role: "student" })
                .collection("Payments")
                .doc(doc.id)
                .get();
            await firebase.assertFails(query);
        });
        test("wrong teacher read", async () => {
            const query = getFireStore(CreateAuth())
                .collection("Payments")
                .doc(doc.id)
                .get();
            await firebase.assertFails(query);
        });
    });
    describe("update", () => {
        const doc = getAppAdmin()
            .firestore()
            .collection("Payments")
            .doc(uuid());
        beforeEach(async () => {
            await doc.set(
                createPaymentAdmin(
                    InitialAuth.uid,
                    StudentAuth.uid,
                    courseDoc.id
                )
            );
        });
        afterAll(async () => {
            await doc.delete();
        });
        test("authorized update", async () => {
            const query = AuthFire.collection("Payments").doc(doc.id).update({
                userId: uuid(),
            });
            await firebase.assertFails(query);
        });
        test("unauthorized read", async () => {
            const query = getFireStore()
                .collection("Payments")
                .doc(doc.id)
                .update({
                    userId: uuid(),
                });
            await firebase.assertFails(query);
        });
        test("student read", async () => {
            const query = getFireStore(StudentAuth)
                .collection("Payments")
                .doc(doc.id)
                .update({
                    userId: uuid(),
                });
            await firebase.assertFails(query);
        });
        test("wrong student read", async () => {
            const query = getFireStore({ ...CreateAuth(), role: "student" })
                .collection("Payments")
                .doc(doc.id)
                .update({
                    userId: uuid(),
                });
            await firebase.assertFails(query);
        });
        test("wrong teacher read", async () => {
            const query = getFireStore(CreateAuth())
                .collection("Payments")
                .doc(doc.id)
                .update({
                    userId: uuid(),
                });
            await firebase.assertFails(query);
        });
    });
});
