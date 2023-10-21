import * as firebase from "@firebase/testing";
import { CreateAuth, InitialAuth, getFireStore, uuid } from "../utils";
import { CompleteLevelData } from "../level";
import { createCourseData } from "../course";
import { expect } from "chai";
import { createExamData } from ".";
import { createLessonData } from "../lesson";

describe("Exams", () => {
    const Auth = getFireStore(InitialAuth);
    const levelDoc = Auth.collection("Levels").doc(uuid());
    const courseDoc = Auth.collection("Courses").doc(uuid());
    const lessonDoc = Auth.collection("Lessons").doc(uuid());
    const completeExamData = createExamData(lessonDoc.id, courseDoc.id);
    beforeAll(async () => {
        await levelDoc.set(CompleteLevelData);
        await courseDoc.set(createCourseData(levelDoc.id));
        await lessonDoc.set(createLessonData(courseDoc.id));
    });
    afterAll(async () => {
        await courseDoc.delete();
        await levelDoc.delete();
    });
    describe("create", () => {
        test("Authorized create", async () => {
            const query = Auth.collection("Exams").add(completeExamData);
            await firebase.assertSucceeds(query);
        });
        test("UnAuthorized create", async () => {
            const query = getFireStore()
                .collection("Exams")
                .add(completeExamData);
            await firebase.assertFails(query);
        });
        test("Authorized but wrong teacher id", async () => {
            const query = getFireStore(CreateAuth(uuid()))
                .collection("Exams")
                .add(completeExamData);
            await firebase.assertFails(query);
        });
        test("unKnown CourseId", async () => {
            const query = Auth.collection("Exams").add({
                ...completeExamData,
                courseId: "unknown course id",
            });
            await firebase.assertFails(query);
        });
        test("unKnown LessonId", async () => {
            const query = Auth.collection("Exams").add({
                ...completeExamData,
                courseId: "LessonId",
            });
            await firebase.assertFails(query);
        });
        test("unknown teacher", async () => {
            const query = Auth.collection("Exams").add({
                ...completeExamData,
                teacherId: "unknown course id",
            });
            await firebase.assertFails(query);
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
        describe("random options", () => {
            describe("random equal true", () => {
                test("success", async () => {
                    const query = Auth.collection("Exams").add({
                        ...completeExamData,
                        random: true,
                        num: 20,
                    });
                    await firebase.assertSucceeds(query);
                });
                test("question num is zero", async () => {
                    const query = Auth.collection("Exams").add({
                        ...completeExamData,
                        random: true,
                        num: 0,
                    });
                    await firebase.assertFails(query);
                });
                test("wrong type num", async () => {
                    const query = Auth.collection("Exams").add({
                        ...completeExamData,
                        random: true,
                        num: null,
                    });
                    await firebase.assertFails(query);
                });
            });
            describe("random equal false", () => {
                test("success", async () => {
                    const query = Auth.collection("Exams").add({
                        ...completeExamData,
                        random: false,
                        shuffle: true,
                    });
                    await firebase.assertSucceeds(query);
                });

                test("wrong type shuffle", async () => {
                    const query = Auth.collection("Exams").add({
                        ...completeExamData,
                        random: false,
                        shuffle: null,
                    });
                    await firebase.assertFails(query);
                });
            });
        });
        test("So short time", async () => {
            const query = Auth.collection("Exams").add({
                ...completeExamData,
                time: 30,
            });
            await firebase.assertFails(query);
        });
    });
    test("read null", async () => {
        const doc = Auth.collection("Exams").doc(uuid());
        await firebase.assertSucceeds(doc.get());
    });
    describe("delete", () => {
        const doc = Auth.collection("Exams").doc(uuid());
        beforeEach(async () => {
            const res = await doc.get();
            if (!res.exists) await doc.set(completeExamData);
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
                .collection("Exams")
                .doc(doc.id)
                .delete();
            await firebase.assertFails(query);
        });
        test("delete authorized wrong teacher", async () => {
            const query = getFireStore(CreateAuth(uuid()))
                .collection("Exams")
                .doc(doc.id)
                .delete();
            await firebase.assertFails(query);
        });
    });
    describe("read", () => {
        const doc = Auth.collection("Exams").doc(uuid());
        beforeAll(async () => {
            await doc.set(completeExamData);
        });
        afterAll(async () => {
            await doc.delete();
        });

        test("read authorized", async () => {
            await firebase.assertSucceeds(doc.get());
        });
        test("read unauthorized", async () => {
            const query = getFireStore().collection("Exams").doc(doc.id).get();
            await firebase.assertFails(query);
        });
        test("read authorized wrong teacher", async () => {
            const query = getFireStore(CreateAuth(uuid()))
                .collection("Exams")
                .doc(doc.id)
                .get();
            await firebase.assertFails(query);
        });
    });
    describe("update", () => {
        const doc = Auth.collection("Exams").doc(uuid());
        beforeAll(async () => {
            await doc.set(completeExamData);
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
            test("Lesson Id", async () => {
                const data = {
                    lessonId: "new levelId",
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
        describe("random options", () => {
            describe("random equal true", () => {
                test("success", async () => {
                    const query = doc.update({
                        random: true,
                        num: 20,
                    });
                    await firebase.assertSucceeds(query);
                });
                test("question num is zero", async () => {
                    const query = doc.update({
                        random: true,
                        num: 0,
                    });
                    await firebase.assertFails(query);
                });
                test("wrong type num", async () => {
                    const query = doc.update({
                        random: true,
                        num: null,
                    });
                    await firebase.assertFails(query);
                });
            });
            describe("random equal false", () => {
                test("success", async () => {
                    const query = doc.update({
                        random: false,
                        shuffle: true,
                    });
                    await firebase.assertSucceeds(query);
                });

                test("wrong type shuffle", async () => {
                    const query = doc.update({
                        random: false,
                        shuffle: null,
                    });
                    await firebase.assertFails(query);
                });
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

            test("Order", async () => {
                const data = {
                    order: "1",
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
                    .collection("Exams")
                    .doc(doc.id)
                    .update(data);
                await firebase.assertFails(query);
            });
            test("Authorized but wrong teacher id", async () => {
                const query = getFireStore(CreateAuth(uuid()))
                    .collection("Exams")
                    .doc(doc.id)
                    .update(data);
                await firebase.assertFails(query);
            });
        });
    });
});
