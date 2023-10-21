import { getCollection } from "@/firebase";
import { checkPaidCourseUser } from "@/utils/auth";
import { Router } from "express";
import { QueryDocumentSnapshot } from "firebase-admin/firestore";
import { DataBase } from "../../../../src/data";
const router = Router();
declare global {
  namespace Express {
    interface Request {
      lesson: QueryDocumentSnapshot<DataBase["Lessons"]>;
    }
  }
}
router.use(async (req, res, next) => {
  const { lessonId } = req.query;
  if (typeof lessonId != "string")
    return res.status(422).sendData({
      success: false,
      msg: "Wrong token",
    });
  const lesson = await getCollection("Lessons").doc(lessonId).get();
  const lessonData = lesson.data();
  if (!lesson.exists || !lessonData)
    return res.status(404).sendData({
      success: false,
      msg: "The lesson is not exist",
    });

  const state = await checkPaidCourseUser(req.user.uid, lessonData.courseId);
  if (lessonData.hide)
    return res.status(404).sendData({
      success: false,
      msg: "The lesson is not exist",
    });

  if (typeof state == "string") {
    res.status(403).sendData({
      success: false,
      msg: state,
    });
    return;
  }
  req.lesson = lesson as Express.Request["lesson"];
  return next();
});
router.get("/", async (req, res) => {
  const lessonData = req.lesson.data();
  if (!lessonData)
    return res.status(404).sendData({
      success: false,
      msg: "The lesson is not exist",
    });

  const data = { id: req.lesson.id, ...lessonData };
  if (data.video?.hide) delete data.video;
  delete (data as Partial<typeof data>).adderIds;

  return res.status(200).sendData({
    success: true,
    msg: "success",
    data: {
      lesson: data,
    },
  });
});
router.get("/exams", async (req, res) => {
  const lessons = await getCollection("Exams")
    .where("lessonId", "==", req.lesson.id)
    .where("hide", "==", false)
    .orderBy("order")
    .get();

  res.status(200).sendData({
    success: true,
    msg: "success",
    data: {
      exams: lessons.docs.map((val) => {
        const data = val.data();
        return {
          id: val.id,
          name: data.name,
          desc: data.desc,
          time: data.time,
          repeatable: data.repeatable,
        };
      }),
    },
  });
});
export default router;
