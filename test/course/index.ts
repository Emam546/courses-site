import { InitialAuth } from "../utils";
import * as firebase from "@firebase/testing";
export function createCourseData(levelId: string) {
    return {
        name: "Course Name",
        desc: "desc",
        teacherId: InitialAuth.uid,
        levelId,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        price: {
            num: 20,
            currency: "USD",
        },
        publishedAt: firebase.firestore.FieldValue.serverTimestamp(),
        hide: false,
        featured: true,
        order: 0,
    };
}
