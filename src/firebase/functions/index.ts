import { httpsCallable } from "@firebase/functions";
import { functions } from "..";
import type { RegisterRequestData, RegisterResponseData } from "@func/teacher";
export const createTeacherCall = httpsCallable<
    RegisterRequestData,
    RegisterResponseData
>(functions, "registerTeacher");
