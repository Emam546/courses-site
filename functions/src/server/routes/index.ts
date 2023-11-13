import { Router } from "express";
import teacherRouter from "./teacher";
import levelsRouter from "./level";
import studentRouter from "./student";
import lessonsRouter from "./lesson";
import authRouter from "./auth/index";
import courseRouter from "./course";
import questionsRouter from "./questions";
import examsRouter from "./exams";
import resultsRouter from "./results";

import { Auth } from "./middleware";

const router = Router();
router.use("/auth", authRouter);
router.use("/teacher", teacherRouter);
router.use("/level", levelsRouter);
router.use("/course", courseRouter);

router.use(Auth);
router.use("/lesson", lessonsRouter);
router.use("/student", studentRouter);
router.use("/question", questionsRouter);
router.use("/exam", examsRouter);
router.use("/result", resultsRouter);
export default router;
