import { Router, Request, Response } from "express";
import { getCollection } from "@/firebase";
import { checkPaidCourseUser } from "@/utils/auth";
import { QueryDocumentSnapshot } from "firebase-admin/firestore";
import { DataBase } from "../../../../src/data";
import { FieldValue } from "firebase-admin/firestore";
import Validator from "validator-checker-js";
import { ErrorMessages, Messages } from "@serv/declarations/major/Messages";
import HttpStatusCodes from "../declarations/major/HttpStatusCodes";
const router = Router();

declare global {
  namespace Express {
    interface Request {
      result: QueryDocumentSnapshot<DataBase["Results"]>;
    }
  }
}
router.use(async (req, res, next) => {
  const { resultId } = req.query;
  if (typeof resultId != "string")
    return res.status(422).sendData({
      success: false,
      msg: ErrorMessages.UnProvidedId,
    });
  const result = await getCollection("Results").doc(resultId).get();
  const resultData = result.data();
  if (!result.exists || !resultData)
    return res.status(404).sendData({
      success: false,
      msg: ErrorMessages.UnExistedDoc,
    });

  if (req.user.uid == resultData.userId)
    return res.status(404).sendData({
      success: false,
      msg: ErrorMessages.UnAuthorized,
    });
  const state = await checkPaidCourseUser(req.user.uid, resultData.courseId);

  if (!state) {
    return res.status(HttpStatusCodes.PAYMENT_REQUIRED).sendData({
      success: false,
      msg: ErrorMessages.UnPaidCourse,
    });
  }

  req.result = result as Express.Request["result"];
  return next();
});
const validator = new Validator({
  questions: [
    {
      questionId: ["string"],
      state: [{ in: ["visited", "unvisited", "marked"] }, "string"],
      answer: ["string"],
    },
    "array",
    ["required"],
  ],
});
router.post("/", async (req, res, next) => {
  const result = req.result;
  const checkRes = validator.passes(req.body);
  if (!checkRes.state) {
    return res.status(400).sendData({
      success: false,
      msg: ErrorMessages.InValidData,
      err: checkRes.errors,
    });
  }
  const exam = await getCollection("Exams").doc(req.result.data().examId).get();

  function getEndState() {
    if (!result || !result.exists) return false;
    const startAt: Date = result.data().startAt.toDate() || new Date();

    if (Date.now() - startAt.getTime() > exam.data()!.time) return true;
    if (typeof result.data().endAt != "undefined") return true;
    return false;
  }
  if (getEndState()) return await endExam(req, res);

  const data = checkRes.data as DataBase["Results"];
  result.ref.update(data);
  return res.sendData({
    success: true,
    msg: Messages.DataUpdated,
    data,
  });
});
async function endExam(req: Request, res: Response) {
  const result = req.result;
  const questions = await Promise.all(
    req.result.data().questions.map(async (data) => {
      const quest = await getCollection("Questions").doc(data.questionId).get();
      const questData = quest.data();
      if (!questData)
        return {
          ...data,
          correctAnswer: data.answer || "",
          correctState: true,
        };
      return {
        ...data,
        correctAnswer: questData.answer,
        correctState: questData.answer == data.answer,
      };
    }),
  );
  await result.ref.update({
    endAt: FieldValue.serverTimestamp(),
    questions: questions,
  });
  return res.sendData({
    success: true,
    msg: Messages.DataUpdated,
    data: {},
  });
}
router.post("/end", endExam);
export default router;
