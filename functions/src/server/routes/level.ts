import { getCollection } from "@/firebase";
import { Router, Request, Express } from "express";
import { ErrorMessages, Messages } from "@serv/declarations/major/Messages";
const router = Router();
declare global {
  namespace Express {
    interface Request {
      levelId: string;
    }
  }
}

router.use(async (req, res, next) => {
  const { levelId } = req.query;
  if (typeof levelId != "string") {
    return res.status(422).sendData({
      success: false,
      msg: ErrorMessages.UnProvidedId,
    });
  }
  req.levelId = levelId;
  return next();
});

router.get("/courses", async (req, res) => {
  const lessons = await getCollection("Courses")
    .where("levelId", "==", req.levelId)
    .where("hide", "==", false)
    .orderBy("order")
    .get();
  const courses = await Promise.all(
    lessons.docs.map(async (val) => {
      const data = val.data();
      const count = await getCollection("Payments")
        .where("courseId", "==", val.id)
        .count()
        .get();

      return {
        id: val.id,
        name: data.name,
        desc: data.desc,
        price: data.price,
        studentNum: count.data().count,
        publishedAt: data.publishedAt,
        featured: data.featured,
      };
    }),
  );
  res.status(200).sendData({
    success: true,
    msg: Messages.DataSuccess,
    data: {
      courses: courses,
    },
  });
});
export default router;
