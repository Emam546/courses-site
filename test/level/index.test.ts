import { expect } from "chai";
import * as firebase from "@firebase/testing";
import {
    CreateAuth,
    InitialAuth,
    PROJECT_ID,
    getAppAdmin,
    getFireStore,
    uuid,
} from "../utils";
import { CompleteLevelData } from ".";

describe("Levels", () => {
    describe("create", () => {
        test("Create Level unauthorized", async () => {
            const query = getFireStore()
                .collection("Levels")
                .add(CompleteLevelData);
            await firebase.assertFails(query);
        });
        test("Create Level Authorized", async () => {
            const query = getFireStore(InitialAuth)
                .collection("Levels")
                .add(CompleteLevelData);
            await firebase.assertSucceeds(query);
        });
        test("Create Level Authorized unTeacher", async () => {
            const query = getFireStore({ ...InitialAuth, role: "undefined" })
                .collection("Levels")
                .add(CompleteLevelData);
            await firebase.assertFails(query);
        });
        test("uncompleted data", async () => {
            const query = getFireStore(InitialAuth).collection("Levels").add({
                name: "Level",
                teacherId: InitialAuth.uid,
            });
            await firebase.assertFails(query);
        });
        test("wrong name types data", async () => {
            const query = getFireStore(InitialAuth)
                .collection("Levels")
                .add({
                    ...CompleteLevelData,
                    name: false,
                });
            await firebase.assertFails(query);
        });
        test("incorrect teacherId types data", async () => {
            const query = getFireStore(InitialAuth)
                .collection("Levels")
                .add({
                    ...CompleteLevelData,
                    teacherId: "un correct userId",
                });
            await firebase.assertFails(query);
        });
        test("add with un existed fields", async () => {
            const query = getFireStore(InitialAuth)
                .collection("Levels")
                .add({
                    ...CompleteLevelData,
                    "unlisted fields": false,
                });
            await firebase.assertFails(query);
        });
    });
    describe("delete", () => {
        const doc = getAppAdmin().firestore().collection("Levels").doc(uuid());
        beforeEach(async () => {
            await doc.set(CompleteLevelData);
        });
        afterAll(async () => {
            await doc.delete();
        });
        test("normal delete", async () => {
            const query = getFireStore(InitialAuth)
                .collection("Levels")
                .doc(doc.id)
                .delete();
            await firebase.assertSucceeds(query);
        });
        test("unauthorized", async () => {
            const query = getFireStore()
                .collection("Levels")
                .doc(doc.id)
                .delete();
            await firebase.assertFails(query);
        });
        test("Unowned Teacher", async () => {
            const query = getFireStore(CreateAuth(uuid()))
                .collection("Levels")
                .doc(doc.id)
                .delete();
            await firebase.assertFails(query);
        });
    });
    describe("get", () => {
        const doc = getAppAdmin().firestore().collection("Levels").doc(uuid());

        afterAll(async () => {
            await doc.delete();
        });
        describe("hide is false", () => {
            beforeAll(async () => {
                await doc.set({ ...CompleteLevelData, hide: false });
            });
            test("authrized list", async () => {
                const query = getFireStore(InitialAuth)
                    .collection("Levels")
                    .doc(doc.id)
                    .get();
                await firebase.assertSucceeds(query);
            });
            test("unauthorized", async () => {
                const query = getFireStore()
                    .collection("Levels")
                    .doc(doc.id)
                    .get();
                await firebase.assertSucceeds(query);
            });
            test("Unowned Teacher", async () => {
                const query = getFireStore(CreateAuth(uuid()))
                    .collection("Levels")
                    .doc(doc.id)
                    .get();
                await firebase.assertSucceeds(query);
            });
        });
        describe("hide is true", () => {
            beforeAll(async () => {
                await doc.set({ ...CompleteLevelData, hide: true });
            });
            test("authrized list", async () => {
                const query = getFireStore(InitialAuth)
                    .collection("Levels")
                    .doc(doc.id)
                    .get();
                await firebase.assertSucceeds(query);
            });
            test("unauthorized", async () => {
                const query = getFireStore()
                    .collection("Levels")
                    .doc(doc.id)
                    .get();
                await firebase.assertFails(query);
            });
            test("Unowned Teacher", async () => {
                const query = getFireStore(CreateAuth(uuid()))
                    .collection("Levels")
                    .doc(doc.id)
                    .get();
                await firebase.assertFails(query);
            });
        });
    });
    describe("list", () => {
        describe("list exist", () => {
            const doc = getAppAdmin()
                .firestore()
                .collection("Levels")
                .doc(uuid());
            beforeAll(async () => {
                await doc.set({ ...CompleteLevelData, hide: false });
            });

            afterAll(async () => {
                await doc.delete();
            });
            describe("no query hide", () => {
                test("normal list", async () => {
                    const query = getFireStore(InitialAuth)
                        .collection("Levels")
                        .where("teacherId", "==", InitialAuth.uid)
                        .get();
                    await firebase.assertSucceeds(query);
                });
                test("unauthorized", async () => {
                    const query = getFireStore()
                        .collection("Levels")
                        .where("teacherId", "==", InitialAuth.uid)
                        .get();
                    await firebase.assertFails(query);
                });
                test("Unowned Teacher", async () => {
                    const query = getFireStore(CreateAuth(uuid()))
                        .collection("Levels")
                        .where("teacherId", "==", InitialAuth.uid)
                        .get();
                    await firebase.assertFails(query);
                });
            });
            describe("hide is false", () => {
                test("normal list", async () => {
                    const query = getFireStore(InitialAuth)
                        .collection("Levels")
                        .where("teacherId", "==", InitialAuth.uid)
                        .where("hide", "==", false)
                        .get();
                    await firebase.assertSucceeds(query);
                });
                test("unAuthorized", async () => {
                    const query = getFireStore()
                        .collection("Levels")
                        .where("teacherId", "==", InitialAuth.uid)
                        .where("hide", "==", false)
                        .get();
                    await firebase.assertSucceeds(query);
                });
                test("Unowned Teacher", async () => {
                    const query = getFireStore(CreateAuth(uuid()))
                        .collection("Levels")
                        .where("teacherId", "==", InitialAuth.uid)
                        .where("hide", "==", false)
                        .get();
                    await firebase.assertSucceeds(query);
                });
            });
            describe("hide is true", () => {
                test("authorized list", async () => {
                    const query = getFireStore(InitialAuth)
                        .collection("Levels")
                        .where("teacherId", "==", InitialAuth.uid)
                        .where("hide", "==", true)
                        .get();
                    await firebase.assertSucceeds(query);
                });
                test("unAuthorized", async () => {
                    const query = getFireStore()
                        .collection("Levels")
                        .where("teacherId", "==", InitialAuth.uid)
                        .where("hide", "==", true)
                        .get();
                    await firebase.assertFails(query);
                });
                test("Unowned Teacher", async () => {
                    const query = getFireStore(CreateAuth(uuid()))
                        .collection("Levels")
                        .where("teacherId", "==", InitialAuth.uid)
                        .where("hide", "==", true)
                        .get();
                    await firebase.assertFails(query);
                });
            });
        });
        describe("list empty", () => {
            describe("no query hide", () => {
                test("normal list", async () => {
                    const query = getFireStore(InitialAuth)
                        .collection("Levels")
                        .where("teacherId", "==", InitialAuth.uid)
                        .get();
                    await firebase.assertSucceeds(query);
                });
                test("unauthorized", async () => {
                    const query = getFireStore()
                        .collection("Levels")
                        .where("teacherId", "==", InitialAuth.uid)
                        .get();
                    await firebase.assertFails(query);
                });
                test("Unowned Teacher", async () => {
                    const query = getFireStore(CreateAuth(uuid()))
                        .collection("Levels")
                        .where("teacherId", "==", InitialAuth.uid)
                        .get();
                    await firebase.assertFails(query);
                });
            });
            describe("hide is false", () => {
                test("normal list", async () => {
                    const query = getFireStore(InitialAuth)
                        .collection("Levels")
                        .where("teacherId", "==", InitialAuth.uid)
                        .where("hide", "==", false)
                        .get();
                    await firebase.assertSucceeds(query);
                });
                test("unAuthorized", async () => {
                    const query = getFireStore()
                        .collection("Levels")
                        .where("teacherId", "==", InitialAuth.uid)
                        .where("hide", "==", false)
                        .get();
                    await firebase.assertSucceeds(query);
                });
                test("Unowned Teacher", async () => {
                    const query = getFireStore(CreateAuth(uuid()))
                        .collection("Levels")
                        .where("teacherId", "==", InitialAuth.uid)
                        .where("hide", "==", false)
                        .get();
                    await firebase.assertSucceeds(query);
                });
            });
            describe("hide is true", () => {
                test("authorized list", async () => {
                    const query = getFireStore(InitialAuth)
                        .collection("Levels")
                        .where("teacherId", "==", InitialAuth.uid)
                        .where("hide", "==", true)
                        .get();
                    await firebase.assertSucceeds(query);
                });
                test("unAuthorized", async () => {
                    const query = getFireStore()
                        .collection("Levels")
                        .where("teacherId", "==", InitialAuth.uid)
                        .where("hide", "==", true)
                        .get();
                    await firebase.assertFails(query);
                });
                test("Unowned Teacher", async () => {
                    const query = getFireStore(CreateAuth(uuid()))
                        .collection("Levels")
                        .where("teacherId", "==", InitialAuth.uid)
                        .where("hide", "==", true)
                        .get();
                    await firebase.assertFails(query);
                });
            });
        });
    });

    describe("Update", () => {
        const doc = getFireStore(InitialAuth).collection("Levels").doc(uuid());
        beforeEach(async () => {
            await getAppAdmin()
                .firestore()
                .collection("Levels")
                .doc(doc.id)
                .set(CompleteLevelData);
        });
        afterAll(async () => {
            await getAppAdmin()
                .firestore()
                .collection("Levels")
                .doc(doc.id)
                .delete();
        });
        describe("success", () => {
            test("name", async () => {
                const data = {
                    name: "new Name",
                };
                const query = doc.update(data);
                await firebase.assertSucceeds(query);
                const res = await doc.get();
                expect(res.data()?.name).eq(data.name);
            });
            test("desc", async () => {
                const data = {
                    desc: "new desc",
                };
                const query = doc.update(data);
                await firebase.assertSucceeds(query);
                const res = await doc.get();
                expect(res.data()?.desc).eq(data.desc);
            });
        });
        test("no fields", async () => {
            const query = doc.update({});
            await firebase.assertSucceeds(query);
        });
        test("set field as null", async () => {
            const query = doc.update({ name: null });
            await firebase.assertFails(query);
        });
        describe("wrong", () => {
            test("wrong name", async () => {
                const query = doc.update({ name: false });
                await firebase.assertFails(query);
            });
            test("wrong desc", async () => {
                const query = doc.update({ desc: false });
                await firebase.assertFails(query);
            });
        });
        test("change teacherId", async () => {
            const query = doc.update({ teacherId: "new TeacherId" });
            await firebase.assertFails(query);
        });
        test("change unAuthorized", async () => {
            const query = getFireStore()
                .collection("Levels")
                .doc(doc.id)
                .update({ name: "new name" });
            await firebase.assertFails(query);
        });
        test("change wrong teacher", async () => {
            const query = getFireStore(CreateAuth(uuid()))
                .collection("Levels")
                .doc(doc.id)
                .update({ name: "new name" });
            await firebase.assertFails(query);
        });
        test("add non-existed fields", async () => {
            const data = {
                "unknown field": "data",
            };
            await firebase.assertFails(doc.update(data));
        });
    });
});
