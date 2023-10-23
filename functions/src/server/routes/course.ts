import { getCollection } from "@/firebase";
import { checkPaidCourseUser } from "@/utils/auth";
import { Router, Request, Express } from "express";
import { ErrorMessages, Messages } from "@serv/declarations/major/Messages";
import HttpStatusCodes from "../declarations/major/HttpStatusCodes";
const router = Router();
declare global {
  namespace Express {
    interface Request {
      courseId: string;
    }
  }
}

router.use(async (req, res, next) => {
  const { courseId } = req.query;
  if (typeof courseId != "string") {
    res.status(422).sendData({
      success: false,
      msg: ErrorMessages.UnProvidedId,
    });
    return;
  }
  const state = await checkPaidCourseUser(req.user.uid, courseId);
  if (!state) {
    res.status(HttpStatusCodes.PAYMENT_REQUIRED).sendData({
      success: false,
      msg: ErrorMessages.UnPaidCourse,
    });
    return;
  }
  next();
});

router.get("/lessons", async (req, res) => {
  const lessons = await getCollection("Lessons")
    .where("courseId", "==", req.courseId)
    .where("hide", "==", false)
    .orderBy("order")
    .get();

  res.status(200).sendData({
    success: true,
    msg: Messages.DataSuccess,
    data: {
      lessons: lessons.docs.map((val) => {
        const data = val.data();

        return {
          id: val.id,
          name: data.name,
          briefDesc: data.briefDesc,
          publishedAt: data.publishedAt,
          order: data.order,
        };
      }),
    },
  });
});
export default router;
