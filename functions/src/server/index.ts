import app from "./server";
import { onRequest } from "firebase-functions/v1/https";

export const getData = onRequest(app);
