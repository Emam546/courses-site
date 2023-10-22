import { getCollection } from "@/firebase";
import { Request } from "firebase-functions/v1/https";
export function getIdToken(req: Request): string | null {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    return req.headers.authorization.split("Bearer ")[1];
  } else if (req.cookies) {
    return req.cookies.__session;
  } else {
    return null;
  }
}
export async function checkPaidCourseUser(userId: string, courseId: string) {
  const res = await getCollection("Payments")
    .where("userId", "==", userId)
    .where("courseId", "==", courseId)
    .limit(1)
    .get();
  if (res.empty) return false;
  return true;
}
