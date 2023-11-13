import { Router } from "express";
import { Messages } from "../declarations/major/Messages";
import { getCollection } from "@/firebase";
import HttpStatusCodes from "../declarations/major/HttpStatusCodes";
const router = Router();

router.get("/", async (req, res) => {
  return res.status(200).sendData({
    success: true,
    msg: Messages.DataSuccess,
    data: {
      user: req.user,
    },
  });
});
router.delete("/delete", async (req, res) => {
  const user = req.user;
  await getCollection("Students").doc(user.id).delete();
  res.status(HttpStatusCodes.OK).end();
});
export default router;
