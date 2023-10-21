import { expect } from "chai";
import * as firebase from "@firebase/testing";
import { CreateAuth, InitialAuth, getFireStore, uuid } from "../utils";
import { CompleteLevelData } from "../level";
import { createCourseData } from ".";

describe("Courses", () => {
    const levelDoc = getFireStore(InitialAuth).collection("Levels").doc(uuid());
    const completedData = createCourseData(levelDoc.id);
    beforeAll(async () => {
        await levelDoc.set(CompleteLevelData);
    });
    afterAll(async () => {
        await levelDoc.delete();
    });
    describe("create", () => {
        test("Create Course unauthorized", async () => {
            const query = getFireStore()
                .collection("Courses")
                .add(completedData);
            await firebase.assertFails(query);
        });
        test("Create Course Authorized", async () => {
            const query = getFireStore(InitialAuth)
                .collection("Courses")
                .add(completedData);
            await firebase.assertSucceeds(query);
        });
        describe("wrong", () => {
            describe("price", () => {
                test("wrong price type", async () => {
                    const query = getFireStore(InitialAuth)
                        .collection("Courses")
                        .add({ ...completedData, price: false });
                    await firebase.assertFails(query);
                });
                test("Wrong price number", async () => {
                    const query = getFireStore(InitialAuth)
                        .collection("Courses")
                        .add({
                            ...completedData,
                            price: {
                                num: -1,
                                currency: "USD",
                            },
                        });
                    await firebase.assertFails(query);
                });
                test("unCompleted data", async () => {
                    const query = getFireStore(InitialAuth)
                        .collection("Courses")
                        .add({
                            ...completedData,
                            price: {
                                num: 20,
                            },
                        });
                    await firebase.assertFails(query);
                });
            });
            test("un existed levelId", async () => {
                const query = getFireStore(InitialAuth)
                    .collection("Courses")
                    .add({
                        ...completedData,
                        levelId: "wrong level id",
                    });
                await firebase.assertFails(query);
            });
            test("Teacher Id", async () => {
                const query = getFireStore(InitialAuth)
                    .collection("Courses")
                    .add({
                        ...completedData,
                        teacherId: "wrong teacher id",
                    });
                await firebase.assertFails(query);
            });
        });
        test("uncompleted data", async () => {
            const query = getFireStore(InitialAuth)
                .collection("Courses")
                .add({
                    name: "Course Name",
                    desc: "desc",
                    teacherId: InitialAuth.uid,
                    levelId: levelDoc.id,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    price: {
                        num: 20,
                        currency: "USD",
                    },
                });
            await firebase.assertFails(query);
        });
    });
    describe("update", () => {
        const doc = getFireStore(InitialAuth).collection("Courses").doc(uuid());

        beforeAll(async () => {
            const res = await doc.get();
            if (res.exists) await doc.delete();
            await doc.set(completedData);
        });
        afterAll(async () => {
            await doc.delete();
        });
        test("name", async () => {
            const data = {
                name: "new Name",
            };
            const query = doc.update(data);
            await firebase.assertSucceeds(query);
            const res = await doc.get();
            expect(res.data()?.name).eq(data.name);
        });
        test("publish At", async () => {
            const data = {
                publishedAt: firebase.firestore.FieldValue.serverTimestamp(),
            };
            await firebase.assertSucceeds(doc.update(data));
        });
        test("price", async () => {
            const data = {
                price: {
                    num: 30,
                    currency: "USD",
                },
            };
            await firebase.assertSucceeds(doc.update(data));
        });
        test("hide field", async () => {
            const data = {
                hide: false,
            };
            await firebase.assertSucceeds(doc.update(data));
        });
        test("order field", async () => {
            const data = {
                order: 20,
            };
            await firebase.assertSucceeds(doc.update(data));
        });
        describe("unAllowed fields", () => {
            test("teacher Id", async () => {
                const data = {
                    teacherId: "new teacherId",
                };
                await firebase.assertFails(doc.update(data));
            });
            test("Level Id", async () => {
                const data = {
                    levelId: "new levelId",
                };
                await firebase.assertFails(doc.update(data));
            });
            test("Created At", async () => {
                const data = {
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                };
                await firebase.assertFails(doc.update(data));
            });
        });
        describe("Wrong", () => {
            test("un complete data price", async () => {
                const data = {
                    price: {
                        num: 30,
                    },
                };
                await firebase.assertFails(doc.update(data));
            });
            test("wrong data price", async () => {
                const data = {
                    price: {
                        num: 30,
                        currency: false,
                    },
                };
                await firebase.assertFails(doc.update(data));
            });
            test("Order", async () => {
                const data = {
                    order: "1",
                };
                await firebase.assertFails(doc.update(data));
            });
            test("Wrong PublishedAt field", async () => {
                const data = {
                    PublishedAt: "new Date()",
                };
                await firebase.assertFails(doc.update(data));
            });
        });
        test("un existed field", async () => {
            const data = {
                "new field": "data",
            };
            await firebase.assertFails(doc.update(data));
        });
    });
    describe("delete", () => {
        const doc = getFireStore(InitialAuth).collection("Courses").doc(uuid());
        beforeEach(async () => {
            const res = await doc.get();
            if (!res.exists) await doc.set(completedData);
        });
        afterAll(async () => {
            const res = await doc.get();
            if (res.exists) await doc.delete();
        });
        test("normal delete", async () => {
            await firebase.assertSucceeds(doc.delete());
        });
        test("un Authorized", async () => {
            const query = getFireStore()
                .collection("Courses")
                .doc(doc.id)
                .delete();
            await firebase.assertFails(query);
        });
        test("Un Owned Teacher", async () => {
            const query = getFireStore(CreateAuth(uuid()))
                .collection("Courses")
                .doc(doc.id)
                .delete();
            await firebase.assertFails(query);
        });
    });
});
