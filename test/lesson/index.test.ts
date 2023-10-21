import * as firebase from "@firebase/testing";
import { CreateAuth, InitialAuth, getFireStore, uuid } from "../utils";
import { CompleteLevelData } from "../level";
import { createCourseData } from "../course";
import { expect } from "chai";
import { createLessonData } from ".";

describe("Lessons", () => {
    const Auth = getFireStore(InitialAuth);
    const levelDoc = Auth.collection("Levels").doc(uuid());
    const courseDoc = Auth.collection("Courses").doc(uuid());
    const completeLessonData = createLessonData(courseDoc.id);
    beforeAll(async () => {
        await levelDoc.set(CompleteLevelData);
        await courseDoc.set(createCourseData(levelDoc.id));
    });
    afterAll(async () => {
        await courseDoc.delete();
        await levelDoc.delete();
    });
    describe("create", () => {
        test("Authorized create", async () => {
            const query = Auth.collection("Lessons").add(completeLessonData);
            await firebase.assertSucceeds(query);
        });
        test("UnAuthorized create", async () => {
            const query = getFireStore()
                .collection("Lessons")
                .add(completeLessonData);
            await firebase.assertFails(query);
        });
        test("Authorized but wrong teacher id", async () => {
            const query = getFireStore(CreateAuth(uuid()))
                .collection("Lessons")
                .add(completeLessonData);
            await firebase.assertFails(query);
        });
        test("unKnown Course id", async () => {
            const query = Auth.collection("Lessons").add({
                ...completeLessonData,
                courseId: "unknown course id",
            });
            await firebase.assertFails(query);
        });
        test("unknown teacher", async () => {
            const query = Auth.collection("Lessons").add({
                ...completeLessonData,
                teacherId: "unknown course id",
            });
            await firebase.assertFails(query);
        });
        test("Wrong adders type", async () => {
            const query = Auth.collection("Lessons").add({
                ...completeLessonData,
                adderIds: false,
            });
            await firebase.assertFails(query);
        });
        test("un existed Course", async () => {
            const query = Auth.collection("Lessons").add({
                ...completeLessonData,
                courseId: "unknown course id",
            });
            await firebase.assertFails(query);
        });
        describe("video", () => {
            test("correct video", async () => {
                const query = Auth.collection("Lessons").add({
                    ...completeLessonData,
                    video: {
                        type: "youtube",
                        id: "id",
                        hide: false,
                    },
                });
                await firebase.assertSucceeds(query);
            });
            test("non-existed video", async () => {
                const query = Auth.collection("Lessons").add({
                    ...completeLessonData,
                    video: null,
                });
                await firebase.assertSucceeds(query);
            });
            test("wrong type", async () => {
                const query = Auth.collection("Lessons").add({
                    ...completeLessonData,
                    video: {
                        type: "unknown type",
                        id: "id",
                        hide: false,
                    },
                });
                await firebase.assertFails(query);
            });
            test("unCompleted data", async () => {
                const query = Auth.collection("Lessons").add({
                    ...completeLessonData,
                    video: {
                        type: "unknown type",
                        id: "id",
                    },
                });
                await firebase.assertFails(query);
            });
            test("wrong id", async () => {
                const query = Auth.collection("Lessons").add({
                    ...completeLessonData,
                    video: {
                        type: "youtube",
                        id: false,
                    },
                });
                await firebase.assertFails(query);
            });
        });
        test("uncompleted data", async () => {
            const query = getFireStore(InitialAuth).collection("Courses").add({
                name: "lesson Name",
                desc: "desc",
                teacherId: InitialAuth.uid,
                courseId: courseDoc.id,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            });
            await firebase.assertFails(query);
        });
    });
    test("read null", async () => {
        const doc = Auth.collection("Lessons").doc(uuid());
        await firebase.assertSucceeds(doc.get());
    });
    describe("delete", () => {
        const doc = Auth.collection("Lessons").doc(uuid());
        beforeEach(async () => {
            const res = await doc.get();
            if (!res.exists) await doc.set(completeLessonData);
        });
        afterAll(async () => {
            const res = await doc.get();
            if (!res.exists) await doc.delete();
        });

        test("delete authorized", async () => {
            await firebase.assertSucceeds(doc.delete());
        });
        test("delete unauthorized", async () => {
            const query = getFireStore()
                .collection("Lessons")
                .doc(doc.id)
                .delete();
            await firebase.assertFails(query);
        });
        test("delete authorized wrong teacher", async () => {
            const query = getFireStore(CreateAuth(uuid()))
                .collection("Lessons")
                .doc(doc.id)
                .delete();
            await firebase.assertFails(query);
        });
    });

    describe("read", () => {
        const doc = Auth.collection("Lessons").doc(uuid());
        beforeAll(async () => {
            await doc.set(completeLessonData);
        });
        afterAll(async () => {
            await doc.delete();
        });
        test("read authorized", async () => {
            await firebase.assertSucceeds(doc.get());
        });
        test("read unauthorized", async () => {
            const query = getFireStore()
                .collection("Lessons")
                .doc(doc.id)
                .get();
            await firebase.assertFails(query);
        });
        test("read authorized wrong teacher", async () => {
            const query = getFireStore(CreateAuth(uuid()))
                .collection("Lessons")
                .doc(doc.id)
                .get();
            await firebase.assertFails(query);
        });
    });

    describe("update", () => {
        const doc = Auth.collection("Lessons").doc(uuid());
        beforeAll(async () => {
            await doc.set(completeLessonData);
        });
        afterAll(async () => {
            await doc.delete();
        });

        test("name", async () => {
            const data = {
                name: "new Name",
            };
            await firebase.assertSucceeds(doc.update(data));
            const res = await doc.get();
            expect(res.data()).contains(data);
        });

        test("un existed field", async () => {
            const data = {
                new_field: false,
            };
            await firebase.assertFails(doc.update(data));
            const res = await doc.get();
            expect(res.data()).not.contains(data);
        });
        test("publish At", async () => {
            const data = {
                publishedAt: firebase.firestore.FieldValue.serverTimestamp(),
            };
            await firebase.assertSucceeds(doc.update(data));
        });
        test("video", async () => {
            const data = {
                video: {
                    id: "id",
                    hide: false,
                    type: "youtube",
                },
            };
            await firebase.assertSucceeds(doc.update(data));
        });
        test("set video as null", async () => {
            const data = {
                video: null,
            };
            await firebase.assertSucceeds(doc.update(data));
        });
        test("set field as null", async () => {
            const query = doc.update({ name: null, desc: "string" });
            await firebase.assertFails(query);
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
            test("Course Id", async () => {
                const data = {
                    courseId: "new levelId",
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
            test("wrong name type", async () => {
                const data = {
                    name: false,
                };
                await firebase.assertFails(doc.update(data));
                const res = await doc.get();
                expect(res.data()).not.contains(data);
            });
            test("un complete data video", async () => {
                const data = {
                    video: {
                        id: "video Id",
                    },
                };
                await firebase.assertFails(doc.update(data));
            });
            test("wrong data video", async () => {
                const data = {
                    video: {
                        id: 30,
                        type: "youtube",
                        hide: false,
                    },
                };
                await firebase.assertFails(doc.update(data));
            });
            test("wrong type video", async () => {
                const data = {
                    video: {
                        id: "30",
                        type: "unknown type",
                        hide: false,
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
            test("Wrong type hide", async () => {
                const data = {
                    hide: "string",
                };
                await firebase.assertFails(doc.update(data));
            });
        });
        describe("Authorization", () => {
            const data = {
                name: "new name",
            };
            test("UnAuthorized update", async () => {
                const query = getFireStore()
                    .collection("Lessons")
                    .doc(doc.id)
                    .update(data);
                await firebase.assertFails(query);
            });
            test("Authorized but wrong teacher id", async () => {
                const query = getFireStore(CreateAuth(uuid()))
                    .collection("Lessons")
                    .doc(doc.id)
                    .update(data);
                await firebase.assertFails(query);
            });
        });
    });
});
