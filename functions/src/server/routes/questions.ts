import { getCollection } from "@/firebase";
import { Router } from "express";
import { ErrorMessages, Messages } from "../declarations/major/Messages";
import { shuffle } from "@/utils";
import HttpStatusCodes from "../declarations/major/HttpStatusCodes";
const router = Router();

router.get("/", async (req, res) => {
  const { questionId } = req.query;
  if (typeof questionId != "string")
    return res.status(422).sendData({
      success: false,
      msg: ErrorMessages.UnProvidedId,
    });

  const question = await getCollection("Questions").doc(questionId).get();
  const data = question.data();
  if (!question.exists || !data)
    return res.status(HttpStatusCodes.NOT_FOUND).sendData({
      success: false,
      msg: ErrorMessages.UnExistedDoc,
    });

  const choices = data.shuffle ? shuffle(data.choices) : data.choices;

  return res.status(200).sendData({
    success: true,
    msg: Messages.DataSuccess,
    data: {
      question: {
        id: question.id,
        choices,
        quest: data.quest,
        creatorId: data.creatorId,
        lessonId: data.lessonId,
        courseId: data.courseId,
        searchId: data.createdAt.toDate().getTime(),
      },
    },
  });
});
export default router;
