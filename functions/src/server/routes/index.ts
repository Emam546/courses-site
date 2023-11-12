import { Router } from "express";
import levelsRouter from "./level";
import studentRouter from "./student";
import lessonsRouter from "./lesson";
import authRouter from "./auth/index";
import courseRouter from "./course";
import questionsRouter from "./questions";
import examsRouter from "./exams";
import resultsRouter from "./results";
import { ErrorMessages } from "@serv/declarations/major/Messages";
import HttpStatusCodes from "../declarations/major/HttpStatusCodes";
import { decode } from "@serv/utils/jwt";

const router = Router();
router.use("/auth", authRouter);
router.use("/level", levelsRouter);

router.use(async (req, res, next) => {
  const token = req.cookies.token;
  if (typeof token != "string")
    return res
      .status(HttpStatusCodes.UNAUTHORIZED)
      .sendData({ success: false, msg: ErrorMessages.UnAuthorized });
  try {
    req.user = await decode(token);
    return next();
  } catch (error) {
    res.clearCookie("token");
    return res.status(HttpStatusCodes.UNAUTHORIZED).sendData({
      success: false,
      msg: ErrorMessages.UnAuthorized,
    });
  }
});
router.use("/student", studentRouter);
router.use("/course", courseRouter);
router.use("/lesson", lessonsRouter);
router.use("/question", questionsRouter);
router.use("/exam", examsRouter);
router.use("/result", resultsRouter);
export default router;
