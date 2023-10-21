import { getCollectionReference, getDocument } from "./firebase";
const lesson = getDocument("Lessons");
export const onLessonDeleted = lesson.onDelete(async (doc) => {
  const exams = await getCollectionReference("Exams")
    .where("lessonId", "==", doc.id)
    .orderBy("order")
    .get();
  await Promise.all(exams.docs.map((doc) => doc.ref.delete()));
  const questions = await getCollectionReference("Questions")
    .where("lessonId", "==", doc.id)
    .orderBy("order")
    .get();
  await Promise.all(questions.docs.map((doc) => doc.ref.delete()));
});
