import { Router } from "express";
import { getCollection } from "@/firebase";
import { checkPaidCourseUser } from "@/utils/auth";
import { FieldValue, QueryDocumentSnapshot } from "firebase-admin/firestore";
import { DataBase } from "../../../../src/data";
import { shuffle } from "@/utils";
const router = Router();

function createExamQuestions(
  doc: QueryDocumentSnapshot<DataBase["Exams"]>,
): DataBase["Results"]["questions"] {
  const data = doc.data();
  if (data.random) {
    const questions: DataBase["Results"]["questions"] = [];
    for (let i = 0; i < data.num && data.questionIds.length > 0; i++) {
      const floor = Math.floor(Math.random() * data.questionIds.length);
      const elem = data.questionIds[floor];
      if (elem == undefined) break;
      data.questionIds.splice(floor, 1);
      questions.push({
        correctState: false,
        questionId: elem,
        state: "unvisited",
        correctAnswer: "",
      });
    }
    return questions;
  }
  if (data.shuffle) data.questionIds = shuffle(data.questionIds);

  return data.questionIds.map((id) => ({
    correctState: false,
    questionId: id,
    state: "unvisited",
    correctAnswer: "",
  }));
}

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
      msg: "Wrong token",
    });
  const exam = await getCollection("Exams").doc(examId).get();
  const examData = exam.data();
  if (!exam.exists || !examData)
    return res.status(404).sendData({
      success: false,
      msg: "The lesson is not exist",
    });

  const state = await checkPaidCourseUser(req.user.uid, examData.courseId);
  if (examData.hide)
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

  req.exam = exam as Express.Request["exam"];
  return next();
});
router.get("/", (req, res) => {
  const exam = req.exam;
  const examData = req.exam.data();
  const data = {
    id: exam.id,
    ...examData,
    questionNum: examData.random ? examData.name : examData.questionIds.length,
  };

  delete (data as any).num;
  res.status(200).sendData({
    success: true,
    msg: "success",
    data: {
      exam: data,
    },
  });
});
router.post("/result", async (req, res) => {
  const exam = req.exam;
  const examData = exam.data();
  const resultData = {
    courseId: examData.courseId,
    examId: exam.id,
    startAt: FieldValue.serverTimestamp(),
    teacherId: examData.teacherId,
    userId: req.user.uid,
    questions: createExamQuestions(exam),
  };
  const result = await getCollection("Results").add(resultData);
  return res.sendData({
    success: true,
    msg: "success",
    data: {
      result: {
        id: result.id,
        ...resultData,
      },
    },
  });
});
export default router;
