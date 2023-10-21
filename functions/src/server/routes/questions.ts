import { getCollection } from "@/firebase";
import { Router } from "express";
const router = Router();

router.get("/", async (req, res) => {
  const { questionId } = req.query;
  if (typeof questionId != "string")
    return res.status(422).sendData({
      success: false,
      msg: "Wrong token",
    });

  const question = await getCollection("Questions").doc(questionId).get();
  if (!question.exists)
    return res.status(404).sendData({
      success: false,
      msg: "The lesson is not exist",
    });

  const data = { id: question.id, ...question.data() };
  delete data.answer;
  return res.status(200).sendData({
    success: true,
    msg: "success",
    data: {
      quest: data,
    },
  });
});
export default router;
