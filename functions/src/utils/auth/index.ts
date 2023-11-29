import { getCollection } from "@/firebase";

export async function checkPaidCourseUser(courseId: string,userId?: string) {
  const course = await getCollection("Courses").doc(courseId).get();
  if (!course.exists) return false;
  if (course.data()?.price.num == 0) return true;
  if (!userId) return false;
  const res = await getCollection("Payments")
    .where("userId", "==", userId)
    .where("courseId", "==", courseId)
    .limit(1)
    .get();
  if (res.empty) return false;
  return true;
}
