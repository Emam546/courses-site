import { getCollection } from "@/firebase";
import { Router, Request, Express } from "express";
import { ErrorMessages, Messages } from "@serv/declarations/major/Messages";
import HttpStatusCodes from "../declarations/major/HttpStatusCodes";
import { Auth } from "./middleware";
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

  req.courseId = courseId;
  next();
});
router.get("/", async (req, res) => {
  const course = await getCollection("Courses").doc(req.courseId).get();
  const data = course.data();

  if (!course.exists || !data)
    return res.status(HttpStatusCodes.NOT_FOUND).sendData({
      success: false,
      msg: ErrorMessages.UnExistedDoc,
    });
  if (data.hide)
    return res.status(HttpStatusCodes.NOT_FOUND).sendData({
      success: false,
      msg: ErrorMessages.HidedDoc,
    });
  const count = await getCollection("Payments")
    .where("courseId", "==", course.id)
    .count()
    .get();
  return res.sendData({
    success: true,
    msg: Messages.DataSuccess,
    data: {
      course: {
        id: course.id,
        name: data.name,
        desc: data.desc,
        price: data.price,
        studentNum: count.data().count,
        publishedAt: data.publishedAt,
        featured: data.featured,
      },
    },
  });
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

router.get("/payment", Auth, async (req, res) => {
  const docs = await getCollection("Payments")
    .where("userId", "==", req.user.id)
    .where("courseId", "==", req.courseId)
    .limit(1)
    .get();
  const doc = docs.docs[0];
  if (!doc)
    return res.sendData({
      success: true,
      msg: Messages.DataSuccess,
      data: {
        payment: null,
      },
    });
  return res.sendData({
    success: true,
    msg: Messages.DataSuccess,
    data: {
      payment: {
        id: doc.id,
        ...doc.data(),
      },
    },
  });
});
export default router;
