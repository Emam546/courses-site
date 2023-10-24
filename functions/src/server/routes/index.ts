import { Router } from "express";
import levelsRouter from "./level";
import lessonsRouter from "./lesson";
import courseRouter from "./course";
import questionsRouter from "./questions";
import examsRouter from "./exams";
import resultsRouter from "./results";
import { getIdToken } from "@/utils/auth";
import { Request as RequestFireBase } from "firebase-functions/v1/https";
import { auth } from "@/firebase";
import { ErrorMessages } from "@serv/declarations/major/Messages";
import HttpStatusCodes from "../declarations/major/HttpStatusCodes";

const router = Router();
router.use(async (req, res, next) => {
  const token = getIdToken(req as RequestFireBase);
  if (!token)
    return res
      .status(HttpStatusCodes.UNAUTHORIZED)
      .sendData({ success: false, msg: ErrorMessages.UnAuthorized });
  req.user = await auth.verifyIdToken(token);
  return next();
});
router.get("/level", levelsRouter);
router.get("/course", courseRouter);
router.get("/lesson", lessonsRouter);
router.get("/question", questionsRouter);
router.get("/exam", examsRouter);
router.get("/result", resultsRouter);
export default router;
