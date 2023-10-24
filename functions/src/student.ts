import { firestore, getDocument } from "@/firebase";
const user = getDocument("Students");
export const onUserDelete = user.onDelete(async (doc) => {
  const results = await firestore
    .collection("Results")
    .where("userId", "==", doc.id)
    .orderBy("startAt")
    .get();
  await Promise.all(results.docs.map((doc) => doc.ref.delete()));
});
