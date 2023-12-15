import { QueryDocumentSnapshot } from "firebase-admin/firestore";
import { getCollectionReference, getDocument } from "./firebase";

const course = getDocument("Payments");
async function updatePayment(doc: QueryDocumentSnapshot<DataBase["Payments"]>) {
  const ListDoc = getCollectionReference("EnrolledUsersRecord").doc(
    doc.data().courseId,
  );
  const ListData = await ListDoc.get();
  if (!ListData.exists) return;
  const payments: DataBase["EnrolledUsersRecord"]["payments"] = [
    ...ListData.data()!.payments.filter(({ paymentId }) => paymentId != doc.id),
    {
      paymentId: doc.id,
      userId: doc.data().userId,
    },
  ];
  return ListDoc.update({ payments: payments });
}
export const onPaymentCreate = course.onCreate(async (doc) => {
  await updatePayment(doc);
});

export const onPaymentUpdate = course.onUpdate(async (doc) => {
  await updatePayment(doc.after);
});
export const onPaymentDelete = course.onDelete(async (doc) => {
  const coursePayment = await getCollectionReference("EnrolledUsersRecord")
    .doc(doc.data().courseId)
    .get();

  if (!coursePayment.exists) return;
  await getCollectionReference("EnrolledUsersRecord")
    .doc(coursePayment.id)
    .update({
      payments: coursePayment
        .data()
        ?.payments.filter(({ paymentId }) => paymentId != doc.id),
    });
  return;
});
