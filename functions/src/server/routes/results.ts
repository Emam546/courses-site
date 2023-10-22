import { Router } from "express";
import { getCollection } from "@/firebase";
import { checkPaidCourseUser } from "@/utils/auth";
import { QueryDocumentSnapshot } from "firebase-admin/firestore";
import { DataBase } from "../../../../src/data";
import Validator from "validator-checker-js";
import { ErrorMessages } from "@serv/declarations/major/Messages";
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
    return res.status(403).sendData({
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
    msg: "success",
    data,
  });
});
router.post("/end", async (req, res) => {
  const result = req.result;

  return res.sendData({
    success: true,
    msg: "success",
    data: null,
  });
});
export default router;
