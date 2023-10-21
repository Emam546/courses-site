import { InitialAuth } from "../utils";
import * as firebase from "@firebase/testing";

export function createExamData(lessonId: string, courseId: string) {
    return {
        name: "exam name",
        desc: "desc",
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        teacherId: InitialAuth.uid,
        order: 0,
        courseId,
        lessonId,
        hide: false,
        repeatable: false,
        questionIds: ["question 1"],
        time: 2 * 60 * 1000,
        random: true,
        num: 20,
    };
}
