import { getCollection } from "@/firebase";
import { Router } from "express";
import { ErrorMessages, Messages } from "@serv/declarations/major/Messages";
import { getCourse } from "./level";
const router = Router();
declare global {
  namespace Express {
    interface Request {
      teacherId: string;
    }
  }
}

router.use(async (req, res, next) => {
  const { teacherId } = req.query;
  if (typeof teacherId != "string") {
    return res.status(422).sendData({
      success: false,
      msg: ErrorMessages.UnProvidedId,
    });
  }
  req.teacherId = teacherId;
  return next();
});

router.get("/levels", async (req, res) => {
  const courseNum = req.query.courseNum;
  const levels = await getCollection("Levels")
    .where("teacherId", "==", req.teacherId)
    .where("hide", "==", false)
    .orderBy("order")
    .get();

  res.status(200).sendData({
    success: true,
    msg: Messages.DataSuccess,
    data: {
      levels: await Promise.all(
        levels.docs.map(async (doc) => {
          const data = doc.data();
          const fData = {
            id: doc.id,
            name: data.name,
            desc: data.desc,
          };
          if (!courseNum) return fData;
          const count = await getCollection("Courses")
            .where("levelId", "==", doc.id)
            .where("hide", "==", false)
            .count()
            .get();
          return {
            ...fData,
            courseCount: count.data().count,
          };
        }),
      ),
    },
  });
});

router.get("/featuredCourses", async (req, res) => {
  const courses = await getCollection("Courses")
    .where("teacherId", "==", req.teacherId)
    .where("featured", "==", true)
    .where("hide", "==", false)
    .orderBy("publishedAt")
    .limit(10)
    .get();

  res.status(200).sendData({
    success: true,
    msg: Messages.DataSuccess,
    data: {
      courses: await Promise.all(courses.docs.map(getCourse)),
    },
  });
});

export default router;
