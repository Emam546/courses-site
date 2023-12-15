import { ErrorMessages } from "@/server/declarations/major/Messages";
import HttpStatusCodes from "@serv/declarations/major/HttpStatusCodes";
import { Router } from "express";
import Validator from "validator-checker-js";
import https from "https";
const router = Router();

const validator = new Validator({
  url: ["url", "required"],
});

router.post("/get", async (req, res) => {
  const checkState = validator.passes(req.body);
  if (!checkState.state) {
    res.status(HttpStatusCodes.BAD_REQUEST).sendData({
      success: false,
      msg: ErrorMessages.InValidData,
      err: checkState.errors,
    });
    return;
  }
  https.get(
    checkState.data.url,
    { headers: { range: req.headers.range } },
    (vidRes) => {
      res.status(vidRes.statusCode!);
      vidRes.pipe(res);
    },
  );
});
export default router;
