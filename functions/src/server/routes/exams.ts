import { Router } from "express";
import { getCollection } from "@/firebase";
import { checkPaidCourseUser } from "@/utils/auth";
import { FieldValue, QueryDocumentSnapshot } from "firebase-admin/firestore";

import { shuffle } from "@/utils";
import { ErrorMessages, Messages } from "@serv/declarations/major/Messages";
import HttpStatusCodes from "../declarations/major/HttpStatusCodes";
import { Auth } from "./middleware";
import { createExamQuestions } from "../utils/exam";
const router = Router();

declare global {
  namespace Express {
    interface Request {
      exam: QueryDocumentSnapshot<DataBase["Exams"]>;
    }
  }
}
router.use(async (req, res, next) => {
  const { examId } = req.query;
  if (typeof examId != "string")
    return res.status(422).sendData({
      success: false,
      msg: ErrorMessages.UnProvidedId,
    });
  const exam = await getCollection("Exams").doc(examId).get();
  const examData = exam.data();
  if (!exam.exists || !examData)
    return res.status(HttpStatusCodes.NOT_FOUND).sendData({
      success: false,
      msg: ErrorMessages.UnExistedDoc,
    });

  const state = await checkPaidCourseUser(examData.courseId, req.user.id);
  if (examData.hide)
    return res.status(HttpStatusCodes.LOCKED).sendData({
      success: false,
      msg: ErrorMessages.HidedDoc,
    });

  if (!state) {
    res.status(HttpStatusCodes.PAYMENT_REQUIRED).sendData({
      success: false,
      msg: ErrorMessages.UnPaidCourse,
    });
    return;
  }

  req.exam = exam as Express.Request["exam"];
  return next();
});
router.get("/", (req, res) => {
  const exam = req.exam;
  const examData = req.exam.data();

  res.status(200).sendData({
    success: true,
    msg: Messages.DataSuccess,
    data: {
      exam: {
        id: exam.id,
        name: examData.name,
        desc: examData.desc,
        lessonId: examData.lessonId,
        courseId: examData.courseId,
        teacherId: examData.teacherId,
        repeatable: examData.repeatable,
        time: examData.time,
        num: examData.random ? examData.name : examData.questionIds.length,
      },
    },
  });
});
router.get("/results", Auth, async (req, res) => {
  const results = await getCollection("Results")
    .where("examId", "==", req.exam.id)
    .where("userId", "==", req.user.id)
    .orderBy("startAt", "desc")
    .get();

  res.status(200).sendData({
    success: true,
    msg: Messages.DataSuccess,
    data: {
      results: results.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
    },
  });
});
router.post("/create", Auth, async (req, res) => {
  const exam = req.exam;
  const examData = exam.data();

  const resultData: DataBase["Results"] = {
    courseId: examData.courseId,
    examId: exam.id,
    startAt: FieldValue.serverTimestamp() as any,
    teacherId: examData.teacherId,
    userId: req.user.id,
    questions: createExamQuestions(examData).map((id) => ({
      questionId: id,
      state: "unvisited",
    })),
    time: examData.time,
  };
  if (!examData.repeatable) {
    const data = await getCollection("Results")
      .where("examId", "==", exam.id)
      .where("userId", "==", req.user.id)
      .orderBy("startAt", "desc")
      .limit(1)
      .get();
    if (!data.empty)
      return res.status(HttpStatusCodes.BAD_REQUEST).sendData({
        success: false,
        msg: "the exam is already taken",
      });
  }
  const result = await getCollection("Results").add(resultData);
  return res.sendData({
    success: true,
    msg: Messages.DataCreated,
    data: {
      result: {
        id: result.id,
        ...resultData,
      },
    },
  });
});
export default router;
