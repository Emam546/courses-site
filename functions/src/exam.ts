import { getCollectionReference, getDocument } from "./firebase";

const exam = getDocument("Exams");

export const onExamDeleted = exam.onDelete(async (doc) => {
  const exams = await getCollectionReference("Results")
    .where("examId", "==", doc.id)
    .orderBy("order")
    .get();
  await Promise.all(exams.docs.map((doc) => doc.ref.delete()));
});
