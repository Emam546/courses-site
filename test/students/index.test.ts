import {
    CreateAuth,
    InitialAuth,
    getAppAdmin,
    getFireStore,
    uuid,
} from "../utils";
import { CompleteLevelData } from "../level";
import * as firebase from "@firebase/testing";
import { faker } from "@faker-js/faker";
describe("Students", () => {
    const StudentAuth = { ...CreateAuth(), role: "student" };
    const AuthFire = getFireStore(InitialAuth);
    const levelDoc = AuthFire.collection("Levels").doc(uuid());
    beforeAll(async () => {
        await levelDoc.set(CompleteLevelData);
    });
    afterAll(async () => {
        await levelDoc.delete();
    });
    const docData = {
        displayName: faker.internet.displayName(),

        teacherId: InitialAuth.uid,
        levelId: levelDoc.id,
        blocked: false,
        phone: faker.phone.number(),
    };
    describe("read", () => {
        const doc = getAppAdmin()
            .firestore()
            .collection("Students")
            .doc(StudentAuth.uid);
        beforeAll(async () => {
            await doc.set(docData);
        });
        afterAll(async () => {
            await doc.delete();
        });
        test("read teacher", async () => {
            const query = AuthFire.collection("Students").doc(doc.id).get();
            await firebase.assertSucceeds(query);
        });
        test("read student", async () => {
            const query = getFireStore(StudentAuth)
                .collection("Students")
                .doc(doc.id)
                .get();
            await firebase.assertSucceeds(query);
        });
        test("read un authorized", async () => {
            const query = getFireStore()
                .collection("Students")
                .doc(doc.id)
                .get();
            await firebase.assertFails(query);
        });
        test("read unlisted teacher", async () => {
            const query = getFireStore(CreateAuth())
                .collection("Students")
                .doc(doc.id)
                .get();
            await firebase.assertFails(query);
        });
    });
    describe("update", () => {
        const doc = getAppAdmin()
            .firestore()
            .collection("Students")
            .doc(StudentAuth.uid);
        beforeAll(async () => {
            await doc.set(docData);
        });
        afterAll(async () => {
            await doc.delete();
        });
        describe("teacher", () => {
            test("update level", async () => {
                const data = {
                    levelId: levelDoc.id,
                };
                const query = AuthFire.collection("Students")
                    .doc(doc.id)
                    .update(data);
                await firebase.assertSucceeds(query);
            });
            test("update blocked", async () => {
                const data = {
                    blocked: true,
                };
                const query = AuthFire.collection("Students")
                    .doc(doc.id)
                    .update(data);
                await firebase.assertSucceeds(query);
            });
            describe("unAllowed Fields", () => {
                test("update displayName", async () => {
                    const data = {
                        displayName: "new name",
                    };
                    const query = AuthFire.collection("Students")
                        .doc(doc.id)
                        .update(data);
                    await firebase.assertFails(query);
                });
                test("email", async () => {
                    const data = {
                        email: faker.internet.email(),
                    };
                    const query = AuthFire.collection("Students")
                        .doc(doc.id)
                        .update(data);
                    await firebase.assertFails(query);
                });
                test("teacherId", async () => {
                    const data = {
                        teacherId: uuid(),
                    };
                    const query = AuthFire.collection("Students")
                        .doc(doc.id)
                        .update(data);
                    await firebase.assertFails(query);
                });
                test("userId", async () => {
                    const data = {
                        teacherId: uuid(),
                    };
                    const query = AuthFire.collection("Students")
                        .doc(doc.id)
                        .update(data);
                    await firebase.assertFails(query);
                });
            });
        });
        describe("update student", () => {
            test("displayName", async () => {
                const data = {
                    displayName: faker.internet.displayName(),
                };
                const query = getFireStore(StudentAuth)
                    .collection("Students")
                    .doc(doc.id)
                    .update(data);
                await firebase.assertSucceeds(query);
            });
            test("email", async () => {
                const data = {
                    email: faker.internet.email(),
                };
                const query = getFireStore(StudentAuth)
                    .collection("Students")
                    .doc(doc.id)
                    .update(data);
                await firebase.assertSucceeds(query);
            });
            test("levelId", async () => {
                const data = {
                    levelId: levelDoc.id,
                };
                const query = AuthFire.collection("Students")
                    .doc(doc.id)
                    .update(data);
                await firebase.assertSucceeds(query);
            });
            test("phone", async () => {
                const data = {
                    phone: faker.phone.number(),
                };
                const query = getFireStore(StudentAuth)
                    .collection("Students")
                    .doc(doc.id)
                    .update(data);
                await firebase.assertSucceeds(query);
            });
            describe("Un Allowed Fields", () => {
                test("blocked", async () => {
                    const data = {
                        blocked: false,
                    };
                    const query = getFireStore(StudentAuth)
                        .collection("Students")
                        .doc(doc.id)
                        .update(data);
                    await firebase.assertFails(query);
                });
                test("teacherId", async () => {
                    const data = {
                        teacherId: uuid(),
                    };
                    const query = getFireStore(StudentAuth)
                        .collection("Students")
                        .doc(doc.id)
                        .update(data);
                    await firebase.assertFails(query);
                });
                test("userId", async () => {
                    const data = {
                        teacherId: uuid(),
                    };
                    const query = getFireStore(StudentAuth)
                        .collection("Students")
                        .doc(doc.id)
                        .update(data);
                    await firebase.assertFails(query);
                });
            });
        });
        test("update non-authorized", async () => {
            const data = {
                email: faker.internet.email(),
            };
            const query = getFireStore()
                .collection("Students")
                .doc(doc.id)
                .update(data);
            await firebase.assertFails(query);
        });
        test("update unlisted teacher", async () => {
            const data = {
                blocked: true,
            };
            const query = getFireStore(CreateAuth())
                .collection("Students")
                .doc(doc.id)
                .update(data);
            await firebase.assertFails(query);
        });
    });
    describe("create", () => {
        test("create teacher", async () => {
            const query = AuthFire.collection("Students").add(docData);
            await firebase.assertFails(query);
        });
        test("create student", async () => {
            const query = getFireStore(StudentAuth)
                .collection("Students")
                .add(docData);
            await firebase.assertFails(query);
        });
        test("create un Authorized", async () => {
            const query = getFireStore().collection("Students").add(docData);
            await firebase.assertFails(query);
        });
    });
    describe("delete", () => {
        const doc = getAppAdmin()
            .firestore()
            .collection("Students")
            .doc(StudentAuth.uid);
        beforeEach(async () => {
            await doc.set(docData);
        });
        afterAll(async () => {
            await doc.delete();
        });
        test("delete teacher", async () => {
            const query = AuthFire.collection("Students").doc(doc.id).delete();
            await firebase.assertSucceeds(query);
        });
        test("delete student", async () => {
            const query = getFireStore(StudentAuth)
                .collection("Students")
                .doc(doc.id)
                .delete();
            await firebase.assertFails(query);
        });
        test("delete un authorized", async () => {
            const query = getFireStore()
                .collection("Students")
                .doc(doc.id)
                .delete();
            await firebase.assertFails(query);
        });
        test("delete unlisted teacher", async () => {
            const query = getFireStore(CreateAuth())
                .collection("Students")
                .doc(doc.id)
                .delete();
            await firebase.assertFails(query);
        });
    });
});
