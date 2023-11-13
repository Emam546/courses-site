import HttpStatusCodes from "@serv/declarations/major/HttpStatusCodes";
import { Router } from "express";
const router = Router();

router.get("/video", async (req, res) => {
  res.status(HttpStatusCodes.NOT_IMPLEMENTED).end();
});
export default router;
