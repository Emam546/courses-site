import { getCollection } from "@/firebase";
import { checkPaidCourseUser } from "@/utils/auth";
import { Router, Request, Express } from "express";
const router = Router();
declare global {
  namespace Express {
    interface Request {
      courseId: string;
    }
  }
}

router.use(async (req, res, next) => {
  const { courseId } = req.query;
  if (typeof courseId != "string") {
    res.status(422).sendData({
      success: false,
      msg: "Wrong token",
    });
    return;
  }
  const state = await checkPaidCourseUser(req.user.uid, courseId);
  if (typeof state == "string") {
    res.status(403).sendData({
      success: false,
      msg: state,
    });
    return;
  }
  next();
});
router.get("/lessons", async (req, res) => {
  const lessons = await getCollection("Lessons")
    .where("courseId", "==", req.courseId)
    .where("hide", "==", false)
    .orderBy("order")
    .get();

  res.status(200).sendData({
    success: true,
    msg: "success",
    data: {
      lessons: lessons.docs.map((val) => {
        const data = val.data();

        return {
          id: val.id,
          name: data.name,
          briefDesc: data.briefDesc,
          publishedAt: data.publishedAt,
        };
      }),
    },
  });
});
export default router;
