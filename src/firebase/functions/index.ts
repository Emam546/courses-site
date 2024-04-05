import { httpsCallable } from "@firebase/functions";
import { functions } from "..";
import {
    StudentRegisterRequestData,
    StudentRegisterResponseData,
    TeacherRegisterRequestData,
    TeacherRegisterResponseData,
} from "./types";

export const createTeacherCall = httpsCallable<
    TeacherRegisterRequestData,
    TeacherRegisterResponseData
>(functions, "registerTeacher");
export const createStudentCall = httpsCallable<
    StudentRegisterRequestData,
    StudentRegisterResponseData
>(functions, "createStudent");
