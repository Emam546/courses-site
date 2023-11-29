import * as firestore from "@firebase/testing";
export function createPaymentAdmin(
    teacherId: string,
    userId: string,
    courseId: string
) {
    return {
        userId,
        teacherId,
        courseId,
        activatedAt: firestore.firestore.FieldValue.serverTimestamp(),
        type: "admin",
        price:{
            num:120,
            currency:"EGP"
        }
    };
}
