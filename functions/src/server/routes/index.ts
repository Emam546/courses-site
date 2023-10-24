import { Router } from "express";
import levelsRouter from "./level";
import studentRouter from "./student";
import lessonsRouter from "./lesson";
import authRouter from "./auth/index";
import courseRouter from "./course";
import questionsRouter from "./questions";
import examsRouter from "./exams";
import resultsRouter from "./results";
import { getIdToken } from "@/utils/auth";
import { Request as RequestFireBase } from "firebase-functions/v1/https";
import { ErrorMessages } from "@serv/declarations/major/Messages";
import HttpStatusCodes from "../declarations/major/HttpStatusCodes";
import { decode } from "@serv/utils/jwt";

const router = Router();
router.get("/auth", authRouter);
router.get("/level", levelsRouter);

router.use(async (req, res, next) => {
  const token = getIdToken(req as RequestFireBase);
  if (!token)
    return res
      .status(HttpStatusCodes.UNAUTHORIZED)
      .sendData({ success: false, msg: ErrorMessages.UnAuthorized });
  req.user = await decode(token);
  return next();
});
router.get("/student", studentRouter);
router.get("/course", courseRouter);
router.get("/lesson", lessonsRouter);
router.get("/question", questionsRouter);
router.get("/exam", examsRouter);
router.get("/result", resultsRouter);
export default router;
