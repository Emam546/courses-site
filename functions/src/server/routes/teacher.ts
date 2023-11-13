import { getCollection } from "@/firebase";
import { Router } from "express";
import { ErrorMessages, Messages } from "@serv/declarations/major/Messages";
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
  const levels = await getCollection("Levels")
    .where("teacherId", "==", req.teacherId)
    .where("hide", "==", false)
    .orderBy("createdAt")
    .get();

  res.status(200).sendData({
    success: true,
    msg: Messages.DataSuccess,
    data: {
      levels: levels.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name,
          desc: data.desc,
        };
      }),
    },
  });
});

export default router;
