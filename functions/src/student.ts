import { firestore, getDocument } from "@/firebase";
const user = getDocument("Students");
export const onUserDelete = user.onDelete(async (doc) => {
  await firestore.collection("AuthStudent").doc(doc.id).delete();
  const results = await firestore
    .collection("Results")
    .where("userId", "==", doc.id)
    .get();
  await Promise.all(results.docs.map((doc) => doc.ref.delete()));
});
