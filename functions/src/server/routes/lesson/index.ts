import { getCollection } from "@/firebase";
import { checkPaidCourseUser } from "@/utils/auth";
import { Router } from "express";
import { QueryDocumentSnapshot } from "firebase-admin/firestore";
import videoRouter from "./video";
import { ErrorMessages, Messages } from "@serv/declarations/major/Messages";
import HttpStatusCodes from "@serv/declarations/major/HttpStatusCodes";
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
    return res.status(HttpStatusCodes.NOT_FOUND).sendData({
      success: false,
      msg: ErrorMessages.UnExistedDoc,
    });

  if (lessonData.hide)
    return res.status(HttpStatusCodes.LOCKED).sendData({
      success: false,
      msg: ErrorMessages.HidedDoc,
    });

  const state = await checkPaidCourseUser(lessonData.courseId, req.user.id);

  if (!state) {
    res.status(HttpStatusCodes.PAYMENT_REQUIRED).sendData({
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
    return res.status(HttpStatusCodes.NOT_FOUND).sendData({
      success: false,
      msg: ErrorMessages.UnExistedDoc,
    });

  return res.status(200).sendData({
    success: true,
    msg: Messages.DataSuccess,
    data: {
      lesson: {
        id: req.lesson.id,
        name: data.name,
        courseId: data.courseId,
        desc: data.desc,
        briefDesc: data.briefDesc,
        video: data.video?.hide == true ? undefined : data.video,
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
    msg: Messages.DataSuccess,
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
router.use("/video", videoRouter);
export default router;
