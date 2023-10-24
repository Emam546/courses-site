import { Router } from "express";
import { Messages } from "../declarations/major/Messages";
import { auth } from "@/firebase";
const router = Router();

router.get("/", async (req, res) => {
  const firebaseToken = await auth.createCustomToken(req.user.id);
  return res.status(200).sendData({
    success: true,
    msg: Messages.DataSuccess,
    data: {
      user: req.user,
      firebaseToken,
    },
  });
});
export default router;
