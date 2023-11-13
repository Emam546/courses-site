import { getCollection } from "@/firebase";
import { Router, Request, Express } from "express";
import { ErrorMessages, Messages } from "@serv/declarations/major/Messages";
import { QueryDocumentSnapshot } from "firebase-admin/firestore";
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
router.get("/", async (req, res) => {
  const level = await getCollection("Levels").doc(req.levelId).get();
  const data = level.data();
  if (!data)
    return res.status(200).sendData({
      success: false,
      msg: ErrorMessages.UnExistedDoc,
    });
  return res.status(200).sendData({
    success: true,
    msg: Messages.DataSuccess,
    data: {
      level: {
        id: level.id,
        name: data.name,
        desc: data.desc,
        teacherId: data.teacherId,
      },
    },
  });
});
export async function getCourse(
  doc: QueryDocumentSnapshot<DataBase["Courses"]>,
) {
  const data = doc.data();
  const count = await getCollection("Payments")
    .where("courseId", "==", doc.id)
    .count()
    .get();

  return {
    id: doc.id,
    name: data.name,
    desc: data.desc,
    price: data.price,
    studentNum: count.data().count,
    publishedAt: data.publishedAt,
    featured: data.featured,
  };
}
router.get("/courses", async (req, res) => {
  const lessons = await getCollection("Courses")
    .where("levelId", "==", req.levelId)
    .where("hide", "==", false)
    .orderBy("order")
    .get();
  const courses = await Promise.all(lessons.docs.map(getCourse));
  res.status(200).sendData({
    success: true,
    msg: Messages.DataSuccess,
    data: {
      courses: courses,
    },
  });
});
export default router;
