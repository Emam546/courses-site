import * as firebase from "@firebase/testing";
import { InitialAuth } from "../utils";
export function createResultData(lessonId: string, courseId: string) {
    return {
        quest: "str",
        answer: "str",
        shuffle: false,
        lessonId,
        courseId,
        choices: ["choice", "choice 2"],
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        creatorId: InitialAuth.uid,
    };
}
