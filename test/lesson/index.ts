import { InitialAuth } from "../utils";
import * as firebase from "@firebase/testing";

export function createLessonData(courseId: string) {
    return {
        name: "lesson name",
        desc: "desc",
        briefDesc: "desc",
        publishedAt: firebase.firestore.FieldValue.serverTimestamp(),
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        teacherId: InitialAuth.uid,
        order: 0,
        courseId,
        adderIds: {},
        hide: false,
    };
}
