import { CompleteLevelData } from "../level";
import {
    CreateAuth,
    getAppAdmin,
    getFireStore,
    InitialAuth,
    uuid,
} from "../utils";
import * as firebase from "@firebase/testing";
describe("Results", () => {
    const StudentAuth = { ...CreateAuth(), role: "student" };
    const AuthFire = getFireStore(InitialAuth);
    const levelDoc = AuthFire.collection("Levels").doc(uuid());
    const doc = getAppAdmin().firestore().collection("Results").doc(uuid());

    beforeAll(async () => {
        await levelDoc.set(CompleteLevelData);
        await doc.set({
            teacherId: InitialAuth.uid,
            userId: StudentAuth.uid,
            endAt: null,
        });
    });
    afterAll(async () => {
        await doc.delete();
        await levelDoc.delete();
    });

    describe("read", () => {
        test("read teacher", async () => {
            const query = AuthFire.collection("Results").doc(doc.id).get();
            await firebase.assertSucceeds(query);
        });
        describe("read student", () => {
            afterAll(async () => {
                await doc.set({
                    teacherId: InitialAuth.uid,
                    userId: StudentAuth.uid,
                    endAt: null,
                });
            });
            test("read before the exam ended", async () => {
                const query = getFireStore(StudentAuth)
                    .collection("Results")
                    .doc(doc.id)
                    .get();
                await firebase.assertFails(query);
            });
            test("read after the exam ended", async () => {
                await doc.set({
                    teacherId: InitialAuth.uid,
                    userId: StudentAuth.uid,
                    endAt: firebase.firestore.FieldValue.serverTimestamp(),
                });
                const query = getFireStore(StudentAuth)
                    .collection("Results")
                    .doc(doc.id)
                    .get();
                await firebase.assertSucceeds(query);
            });
        });
        test("read unauthorized", async () => {
            const query = getFireStore()
                .collection("Results")
                .doc(doc.id)
                .get();
            await firebase.assertFails(query);
        });
        test("read unlisted teacher", async () => {
            const query = getFireStore(CreateAuth())
                .collection("Results")
                .doc(doc.id)
                .get();
            await firebase.assertFails(query);
        });
    });

    describe("delete", () => {
        beforeEach(async () => {
            await doc.set({
                teacherId: InitialAuth.uid,
                userId: StudentAuth.uid,
                endAt: null,
            });
        });
        test("delete teacher", async () => {
            const query = AuthFire.collection("Results").doc(doc.id).delete();
            await firebase.assertSucceeds(query);
        });
        describe("delete student", () => {
            afterAll(() => {
                doc.set({
                    teacherId: InitialAuth.uid,
                    userId: StudentAuth.uid,
                    endAt: null,
                });
            });
            test("delete before the exam ended", async () => {
                const query = getFireStore(StudentAuth)
                    .collection("Results")
                    .doc(doc.id)
                    .delete();
                await firebase.assertFails(query);
            });
            test("delete after the exam ended", async () => {
                doc.set({
                    teacherId: InitialAuth.uid,
                    userId: StudentAuth.uid,
                    endAt: firebase.firestore.FieldValue.serverTimestamp(),
                });
                const query = getFireStore(StudentAuth)
                    .collection("Results")
                    .doc(doc.id)
                    .delete();
                await firebase.assertFails(query);
            });
        });
        test("delete un authorized", async () => {
            const query = getFireStore()
                .collection("Results")
                .doc(doc.id)
                .delete();
            await firebase.assertFails(query);
        });
        test("delete unlisted teacher", async () => {
            const query = getFireStore(CreateAuth())
                .collection("Results")
                .doc(doc.id)
                .delete();
            await firebase.assertFails(query);
        });
    });
});
