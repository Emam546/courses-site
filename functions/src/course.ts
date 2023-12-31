import { document } from "firebase-functions/v1/firestore";
import { getCollectionReference } from "./firebase";

const course = document("Courses/{documentId}");

export const onCourseCreate = course.onDelete(async (doc) => {
  await getCollectionReference("EnrolledUsersRecord").doc(doc.id).set({
    payments: [],
    teacherId: doc.data().teacherId,
  });
});
export const onCourseDeleted = course.onDelete(async (doc) => {
  await getCollectionReference("EnrolledUsersRecord").doc(doc.id).delete();

  const docs = await getCollectionReference("Lessons")
    .where("courseId", "==", doc.id)
    .orderBy("order")
    .get();
  return await Promise.all(docs.docs.map((doc) => doc.ref.delete()));
});
