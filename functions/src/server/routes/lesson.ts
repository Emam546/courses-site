import { getCollection } from "@/firebase";
import { checkPaidCourseUser } from "@/utils/auth";
import { Router } from "express";
import { QueryDocumentSnapshot } from "firebase-admin/firestore";
import { DataBase } from "../../../../src/data";
import { ErrorMessages } from "@serv/declarations/major/Messages";
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
      msg: ErrorMessages.UnProvidedId,
    });
  const lesson = await getCollection("Lessons").doc(lessonId).get();
  const lessonData = lesson.data();
  if (!lesson.exists || !lessonData)
    return res.status(404).sendData({
      success: false,
      msg: ErrorMessages.UnExistedDoc,
    });

  if (lessonData.hide)
    return res.status(404).sendData({
      success: false,
      msg: ErrorMessages.HidedDoc,
    });
  const state = await checkPaidCourseUser(req.user.uid, lessonData.courseId);

  if (!state) {
    res.status(403).sendData({
      success: false,
      msg: ErrorMessages.UnPaidCourse,
    });
    return;
  }
  req.lesson = lesson as Express.Request["lesson"];
  return next();
});
router.get("/", async (req, res) => {
  const data = req.lesson.data();
  if (!data)
    return res.status(404).sendData({
      success: false,
      msg: ErrorMessages.UnExistedDoc,
    });

  return res.status(200).sendData({
    success: true,
    msg: "success",
    data: {
      lesson: {
        id: req.lesson.id,
        name: data.name,
        courseId: data.courseId,
        desc: data.desc,
        briefDesc: data.briefDesc,
        vide: data.video,
        publishedAt: data.publishedAt,
        teacherId: data.teacherId,
      },
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
        const num = data.random ? data.num : data.questionIds.length;
        return {
          id: val.id,
          name: data.name,
          desc: data.desc,
          time: data.time,
          repeatable: data.repeatable,
          num,
        };
      }),
    },
  });
});
export default router;
