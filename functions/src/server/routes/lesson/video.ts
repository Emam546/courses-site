import { ErrorMessages, Messages } from "@/server/declarations/major/Messages";
import HttpStatusCodes from "@serv/declarations/major/HttpStatusCodes";
import { Router } from "express";
import Validator from "validator-checker-js";
import { getInfo } from "ytdl-core";
import https from "https";
const router = Router();

router.get("/", async (req, res) => {
  const video = req.lesson.data().video;
  if (!video)
    return res
      .status(HttpStatusCodes.NOT_FOUND)
      .sendData({ msg: ErrorMessages.UnExistedDoc, success: false });
  if (video.hide)
    return res
      .status(HttpStatusCodes.NOT_FOUND)
      .sendData({ msg: ErrorMessages.HidedDoc, success: false });
  try {
    const data = await getInfo(video.id);
    return res.status(200).sendData({
      msg: Messages.DataSuccess,
      success: true,
      data: { video: data },
    });
  } catch (err) {
    return res
      .status(404)
      .json({ msg: "The Video not found", status: false, err });
  }
});
const validator = new Validator({
  url: ["url", "required"],
});

export default router;
