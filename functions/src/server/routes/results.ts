import { Router, Request } from "express";
import { getCollection } from "@/firebase";
import { checkPaidCourseUser } from "@/utils/auth";
import { QueryDocumentSnapshot, Timestamp } from "firebase-admin/firestore";

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
    return res.status(HttpStatusCodes.NOT_FOUND).sendData({
      success: false,
      msg: ErrorMessages.UnExistedDoc,
    });

  if (req.user.id != resultData.userId)
    return res.status(HttpStatusCodes.NOT_FOUND).sendData({
      success: false,
      msg: ErrorMessages.UnAuthorized,
    });
  const state = await checkPaidCourseUser(resultData.courseId, req.user.id);

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
router.get("/", async (req, res) => {
  const resultData = req.result.data();
  return res.sendData({
    success: true,
    msg: Messages.DataSuccess,
    data: {
      result: {
        id: req.result.id,
        ...resultData,
        startAt: resultData.startAt.toDate(),
        endAt: resultData.endAt?.toDate(),
      },
    },
  });
});
router.post("/end", async (req, res) => {
  if (req.result.data().endAt)
    return res.status(HttpStatusCodes.BAD_REQUEST).sendData({
      success: false,
      msg: "The end time was set before",
    });
  return res.sendData({
    success: true,
    msg: Messages.DataUpdated,
    data: await putEndExam(req),
  });
});
router.use(async (req, res, next) => {
  const result = req.result;
  async function getEndState() {
    if (!result || !result.exists) return false;
    if (typeof result.data().endAt != "undefined") return true;
    const startAt: Date = result.data().startAt.toDate() || new Date();
    if (Date.now() - startAt.getTime() > result.data().time) {
      await putEndExam(req);
      return true;
    }
    return false;
  }
  if (await getEndState())
    return res.status(HttpStatusCodes.BAD_REQUEST).sendData({
      success: false,
      msg: "The end time was set before",
    });
  return next();
});

router.post("/", async (req, res) => {
  const result = req.result;
  const checkRes = validator.passes(req.body);
  if (!checkRes.state) {
    return res.status(400).sendData({
      success: false,
      msg: ErrorMessages.InValidData,
      err: checkRes.errors,
    });
  }

  const data = checkRes.data as DataBase["Results"];
  result.ref.update(data);
  return res.sendData({
    success: true,
    msg: Messages.DataUpdated,
    data,
  });
});
async function putEndExam(req: Request) {
  const result = req.result;
  const resultData = result.data();

  if (resultData.endAt)
    return {
      endAt: resultData.endAt.toDate(),
      questions: resultData.questions,
    };

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
  const endAt = Timestamp.fromDate(
    new Date(
      Math.min(
        Date.now(),
        resultData.startAt.toDate().getTime() + resultData.time,
      ),
    ),
  );
  await result.ref.update({
    endAt,
    questions: questions,
  });
  return {
    endAt,
    questions: questions,
  };
}

export default router;
