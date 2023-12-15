import { Router } from "express";
import teacherRouter from "./teacher";
import levelsRouter from "./level";
import studentRouter from "./student";
import lessonsRouter from "./lesson/index";
import authRouter from "./auth/index";
import courseRouter from "./course";
import questionsRouter from "./questions";
import examsRouter from "./exams";
import resultsRouter from "./results";

import { Auth, EncodeUser, isBlocked } from "./middleware";

const router = Router();
router.use("/auth", authRouter);

router.use(EncodeUser);
router.use("/student", studentRouter);
router.use(isBlocked);
router.use("/teacher", teacherRouter);
router.use("/level", levelsRouter);
router.use("/course", courseRouter);
router.use(Auth);
router.use("/lesson", lessonsRouter);
router.use("/exam", examsRouter);
router.use("/question", questionsRouter);
router.use("/result", resultsRouter);
export default router;
