import { Router } from "express";
import { ErrorMessages, Messages } from "../declarations/major/Messages";
import { getCollection } from "@/firebase";
import HttpStatusCodes from "../declarations/major/HttpStatusCodes";
import Validator from "validator-checker-js";
import { Auth } from "./middleware";
const router = Router();
router.use(Auth);
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
const validator = new Validator({
  phone: ["string"],
  displayname: ["string"],
  levelId: ["string", { existedId: { path: "Levels" } }],
  ".": ["required"],
});
router.post("/", async (req, res) => {
  const state = await validator.asyncPasses(req.body);
  if (!state.state)
    return res.status(HttpStatusCodes.BAD_REQUEST).sendData({
      success: false,
      msg: ErrorMessages.InValidData,
    });

  const user = req.user;
  await getCollection("Students").doc(user.id).update(req.body);
  return res.status(HttpStatusCodes.OK).end();
});
export default router;
