import * as firebase from "@firebase/testing";
import { CreateAuth, InitialAuth, getFireStore, uuid } from "../utils";
import { CompleteLevelData } from "../level";
import { createCourseData } from "../course";
import { createLessonData } from "../lesson";
import { createQuestionData } from ".";
import { expect } from "chai";
describe("Questions", () => {
    const Auth = getFireStore(InitialAuth);
    const levelDoc = Auth.collection("Levels").doc(uuid());
    const courseDoc = Auth.collection("Courses").doc(uuid());
    const lessonDoc = Auth.collection("Lessons").doc(uuid());
    const completeQuestionData = createQuestionData(lessonDoc.id, courseDoc.id);
    beforeAll(async () => {
        await levelDoc.set(CompleteLevelData);
        await courseDoc.set(createCourseData(levelDoc.id));
        await lessonDoc.set(createLessonData(courseDoc.id));
    });
    afterAll(async () => {
        await levelDoc.delete();
    });
    describe("create", () => {
        test("Authorized create", async () => {
            const query =
                Auth.collection("Questions").add(completeQuestionData);
            await firebase.assertSucceeds(query);
        });
        test("Authorized 2 create", async () => {
            const query = Auth.collection("Questions").add({
                ...completeQuestionData,
                answer: "answer",
            });
            await firebase.assertSucceeds(query);
        });
        test("UnAuthorized create", async () => {
            const query = getFireStore()
                .collection("Questions")
                .add(completeQuestionData);
            await firebase.assertFails(query);
        });
        test("Authorized but wrong teacher id", async () => {
            const query = getFireStore(CreateAuth(uuid()))
                .collection("Questions")
                .add(completeQuestionData);
            await firebase.assertFails(query);
        });
        test("unKnown Course id", async () => {
            const query = Auth.collection("Questions").add({
                ...completeQuestionData,
                courseId: "unknown course id",
            });
            await firebase.assertFails(query);
        });
        test("empty choices", async () => {
            const query = Auth.collection("Questions").add({
                ...completeQuestionData,
                choices: [],
            });
            await firebase.assertFails(query);
        });
        test("Wrong answer type", async () => {
            const query = Auth.collection("Questions").add({
                ...completeQuestionData,
                answer: false,
            });
            await firebase.assertFails(query);
        });

        test("Wrong choices type", async () => {
            const query = Auth.collection("Questions").add({
                ...completeQuestionData,
                choices: false,
            });
            await firebase.assertFails(query);
        });
        test("un existed Course", async () => {
            const query = Auth.collection("Questions").add({
                ...completeQuestionData,
                courseId: "unknown course id",
            });
            await firebase.assertFails(query);
        });
        test("un existed LessonId", async () => {
            const query = Auth.collection("Questions").add({
                ...completeQuestionData,
                lessonId: "unknown lesson id",
            });
            await firebase.assertFails(query);
        });
        test("uncompleted data", async () => {
            const query = getFireStore(InitialAuth).collection("Courses").add({
                quest: "lesson Name",
                answer: "desc",
                courseId: courseDoc.id,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            });
            await firebase.assertFails(query);
        });
        describe("Permissions", () => {
            const newTeacher = CreateAuth(uuid());
            const lessonPermDoc = Auth.collection("Lessons").doc(uuid());

            beforeAll(async () => {
                await lessonPermDoc.set({
                    ...createLessonData(courseDoc.id),
                    adderIds: {
                        [newTeacher.uid]: ["editor"],
                    },
                });
            });
            afterAll(async () => {
                await lessonPermDoc.delete();
            });
            test("create with another teacher", async () => {
                const query = getFireStore(newTeacher)
                    .collection("Questions")
                    .add({
                        ...createQuestionData(lessonPermDoc.id, courseDoc.id),
                        creatorId: newTeacher.uid,
                    });
                await firebase.assertSucceeds(query);
            });
            test("create with wrong teacher perm", async () => {
                await lessonPermDoc.update({
                    adderIds: {
                        [newTeacher.uid]: ["falsy-perm"],
                    },
                });
                const query = getFireStore(newTeacher)
                    .collection("Questions")
                    .add(createQuestionData(lessonPermDoc.id, courseDoc.id));
                await firebase.assertFails(query);
            });
        });
    });
    test("read null", async () => {
        const doc = Auth.collection("Questions").doc(uuid());
        await firebase.assertSucceeds(doc.get());
    });
    describe("delete", () => {
        const doc = Auth.collection("Questions").doc(uuid());
        beforeEach(async () => {
            const res = await doc.get();
            if (!res.exists) await doc.set(completeQuestionData);
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
                .collection("Questions")
                .doc(doc.id)
                .delete();
            await firebase.assertFails(query);
        });
        test("delete authorized wrong teacher", async () => {
            const query = getFireStore(CreateAuth(uuid()))
                .collection("Questions")
                .doc(doc.id)
                .delete();
            await firebase.assertFails(query);
        });
        describe("Permissions", () => {
            const newTeacher = CreateAuth(uuid());
            const lessonDoc = Auth.collection("Lessons").doc(
                "LessonWithAdderIdsDelete"
            );
            const doc = Auth.collection("Questions").doc(uuid());
            beforeAll(async () => {
                await lessonDoc.set({
                    ...createLessonData(courseDoc.id),
                    adderIds: {
                        [newTeacher.uid]: ["editor"],
                    },
                });
            });
            beforeEach(async () => {
                const res = await doc.get();
                if (res.exists) return;
                await doc.set(createQuestionData(lessonDoc.id, courseDoc.id));
            });
            afterAll(async () => {
                await lessonDoc.delete();
            });
            test("delete with another teacher", async () => {
                const query = getFireStore(newTeacher)
                    .collection("Questions")
                    .doc(doc.id)
                    .delete();
                await firebase.assertSucceeds(query);
            });
            test("delete with unlisted teacher", async () => {
                const query = getFireStore(CreateAuth(uuid()))
                    .collection("Questions")
                    .doc(doc.id)
                    .delete();
                await firebase.assertFails(query);
            });
            test("delete with wrong teacher perm", async () => {
                await lessonDoc.update({
                    adderIds: {
                        [newTeacher.uid]: ["falsy-perm"],
                    },
                });
                const query = getFireStore(newTeacher)
                    .collection("Questions")
                    .doc(doc.id)
                    .delete();
                await firebase.assertFails(query);
            });
        });
    });
    describe("read", () => {
        const doc = Auth.collection("Questions").doc(uuid());
        beforeAll(async () => {
            await doc.set(completeQuestionData);
        });
        afterAll(async () => {
            await doc.delete();
        });
        test("read authorized", async () => {
            await firebase.assertSucceeds(doc.get());
        });
        test("read unauthorized", async () => {
            const query = getFireStore()
                .collection("Questions")
                .doc(doc.id)
                .get();
            await firebase.assertFails(query);
        });
        test("read authorized wrong teacher", async () => {
            const query = getFireStore(CreateAuth(uuid()))
                .collection("Questions")
                .doc(doc.id)
                .get();
            await firebase.assertFails(query);
        });
        describe("Permissions", () => {
            const newTeacher = CreateAuth(uuid());
            const lessonPermDoc = Auth.collection("Lessons").doc(
                "LessonWithAdderIdsRead"
            );
            const doc = Auth.collection("Questions").doc(uuid());
            beforeAll(async () => {
                await lessonPermDoc.set({
                    ...createLessonData(courseDoc.id),
                    adderIds: {
                        [newTeacher.uid]: ["editor"],
                    },
                });
                await doc.set(
                    createQuestionData(lessonPermDoc.id, courseDoc.id)
                );
            });
            afterAll(async () => {
                await doc.delete();
                await lessonPermDoc.delete();
            });
            test("read with another teacher", async () => {
                const query = getFireStore(newTeacher)
                    .collection("Questions")
                    .doc(doc.id)
                    .get();
                await firebase.assertSucceeds(query);
            });
            test("read with unlisted teacher", async () => {
                const query = getFireStore(CreateAuth(uuid()))
                    .collection("Questions")
                    .doc(doc.id)
                    .get();
                await firebase.assertFails(query);
            });
            test("read with wrong teacher perm", async () => {
                await lessonPermDoc.update({
                    adderIds: {
                        [newTeacher.uid]: ["falsy-perm"],
                    },
                });
                const query = getFireStore(newTeacher)
                    .collection("Questions")
                    .doc(doc.id)
                    .get();
                await firebase.assertFails(query);
            });
        });
    });
    describe("update", () => {
        const doc = Auth.collection("Questions").doc(uuid());
        beforeAll(async () => {
            await doc.set(completeQuestionData);
        });
        afterAll(async () => {
            await doc.delete();
        });

        test("quest", async () => {
            const data = {
                quest: "new quest",
            };
            await firebase.assertSucceeds(doc.update(data));
            const res = await doc.get();
            expect(res.data()).contains(data);
        });
        test("answer", async () => {
            const data = {
                answer: "new answer",
            };
            await firebase.assertSucceeds(doc.update(data));
            const res = await doc.get();
            expect(res.data()).contains(data);
        });
        test("shuffle", async () => {
            const data = {
                shuffle: true,
            };
            await firebase.assertSucceeds(doc.update(data));
            const res = await doc.get();
            expect(res.data()).contains(data);
        });
        describe("UnAllowed Fields", () => {
            test("Lesson id", async () => {
                const data = {
                    lessonId: "new lessonId",
                };
                await firebase.assertFails(doc.update(data));
                const res = await doc.get();
                expect(res.data()).not.contains(data);
            });
            test("Creator id", async () => {
                const data = {
                    creatorId: "new creatorId",
                };
                await firebase.assertFails(doc.update(data));
                const res = await doc.get();
                expect(res.data()).not.contains(data);
            });
            test("course id", async () => {
                const data = {
                    creatorId: "new courseId",
                };
                await firebase.assertFails(doc.update(data));
                const res = await doc.get();
                expect(res.data()).not.contains(data);
            });
        });
        describe("Wrong", () => {});
        describe("Permissions", () => {
            const newTeacher = CreateAuth(uuid());
            const lessonPermDoc = Auth.collection("Lessons").doc(
                "LessonWithAdderIdsRead"
            );
            const doc = Auth.collection("Questions").doc(uuid());
            const data = {
                quest: "new quest",
            };
            beforeAll(async () => {
                await lessonPermDoc.set({
                    ...createLessonData(courseDoc.id),
                    adderIds: {
                        [newTeacher.uid]: ["editor"],
                    },
                });
                await doc.set(
                    createQuestionData(lessonPermDoc.id, courseDoc.id)
                );
            });
            afterAll(async () => {
                await doc.delete();
                await lessonPermDoc.delete();
            });
            test("update with another teacher", async () => {
                const docRef = getFireStore(newTeacher)
                    .collection("Questions")
                    .doc(doc.id);

                await firebase.assertSucceeds(docRef.update(data));
                const res = await doc.get();
                expect(res.data()).contains(data);
            });
            test("update with unlisted teacher", async () => {
                const docRef = getFireStore(CreateAuth(uuid()))
                    .collection("Questions")
                    .doc(doc.id);
                await firebase.assertFails(docRef.update(data));
            });
            test("update with wrong teacher perm", async () => {
                await lessonPermDoc.update({
                    adderIds: {
                        [newTeacher.uid]: ["false-perm"],
                    },
                });
                const docRef = getFireStore(newTeacher)
                    .collection("Questions")
                    .doc(doc.id);

                await firebase.assertFails(docRef.update(data));
            });
        });
    });
});
