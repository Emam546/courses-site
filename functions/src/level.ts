import { getCollectionReference, getDocument } from "./firebase";

const level = getDocument("Levels");
export const onLevelDeleted = level.onDelete(async (doc) => {
  const docs = await getCollectionReference("Courses")
    .where("levelId", "==", doc.id)
    .orderBy("order")
    .get();
  return await Promise.all(docs.docs.map((doc) => doc.ref.delete()));
});
